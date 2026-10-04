import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, CameraOff, AlertCircle, RefreshCw } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  isScanning,
  setIsScanning,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = 'reader';

  // Get available cameras
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Default to back camera if available (usually contains 'back' or 'environment')
          const backCamera = devices.find(
            (device) =>
              device.label.toLowerCase().includes('back') ||
              device.label.toLowerCase().includes('rear') ||
              device.label.toLowerCase().includes('environment')
          );
          setSelectedCameraId(backCamera ? backCamera.id : devices[devices.length - 1].id);
        } else {
          setError('Nenalezena žádná kamera v zařízení.');
        }
      })
      .catch((err) => {
        console.error('Chyba při zjišťování kamer:', err);
        setError('Nelze přistoupit ke kameře. Zkontrolujte oprávnění v prohlížeči.');
      });
  }, []);

  const startScanner = async () => {
    setError(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(regionId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
          ],
          verbose: false,
        });
      }

      const cameraConfig = selectedCameraId
        ? selectedCameraId
        : { facingMode: 'environment' };

      const config = {
        fps: 10,
        qrbox: { width: 280, height: 160 },
        aspectRatio: 1.333333,
      };

      await scannerRef.current.start(
        cameraConfig,
        config,
        (decodedText) => {
          // Play audio beep tone on successful scan
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
          } catch (e) {
            // Audio error ignored
          }

          onScan(decodedText);
        },
        () => {
          // Scanning in progress (no barcode in frame yet)
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error('Chyba při spuštění skeneru:', err);
      setError('Nepodařilo se spustit kameru. ' + (err?.message || ''));
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('Chyba při zastavování skeneru:', err);
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((e) => console.error(e));
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          Skenování čárového kódu
        </h2>
        {cameras.length > 1 && !isScanning && (
          <select
            value={selectedCameraId || ''}
            onChange={(e) => setSelectedCameraId(e.target.value)}
            className="text-xs bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 text-slate-700"
          >
            {cameras.map((cam) => (
              <option key={cam.id} value={cam.id}>
                {cam.label || `Kamera ${cam.id}`}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="relative overflow-hidden rounded-xl bg-slate-900 min-h-[220px] flex flex-col items-center justify-center">
        <div id={regionId} className={`w-full ${isScanning ? 'block' : 'hidden'}`} />

        {!isScanning && (
          <div className="p-6 text-center text-slate-400 flex flex-col items-center">
            <Camera className="w-12 h-12 mb-2 text-slate-500 stroke-1" />
            <p className="text-sm font-medium">Kamera je vypnutá</p>
            <p className="text-xs text-slate-500 mt-1">
              Klikněte na tlačítko níže pro spuštění skenování čárových kódů.
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {!isScanning ? (
          <button
            onClick={startScanner}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            Zapnout kameru a skenovat
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            <CameraOff className="w-5 h-5" />
            Vypnout kameru
          </button>
        )}
      </div>
    </div>
  );
};

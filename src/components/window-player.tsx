import useWebcamStream from '@/lib/hooks/use-webcam-stream';

export const WebcamPlayer = ({ selectedDeviceId }: { selectedDeviceId: string | null }) => {
  const videoRef = useWebcamStream(selectedDeviceId);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="max-w-full max-h-full w-auto h-auto object-contain"
      style={{
        transform: 'scaleX(-1)'
      }}
    />
  );
};

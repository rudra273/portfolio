import Background from '@/components/Particle';

export default function ParticlePage() {
  return (
    <div className="w-full h-screen">
      <Background />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl">
      </div>
    </div>
  );
}
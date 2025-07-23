import Image from 'next/image';
import PoolScene from '../components/PoolScene';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <PoolScene />
    </main>
  );
}

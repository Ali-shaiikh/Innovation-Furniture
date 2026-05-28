import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '360° Panorama Studio | Innovation Designer Furniture',
  description: 'View any equirectangular panorama in an immersive 360° viewer. Paste a URL or drop an image file.',
  openGraph: {
    title: '360° Panorama Studio | Innovation Designer Furniture',
    description: 'Immersive 360° panorama viewer by Innovation Designer Furniture.',
    url: 'https://vr.innovationfurniture.in',
    siteName: 'Innovation Designer Furniture',
    type: 'website',
  },
};

export default function VRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#0A0806',
        minHeight: '100dvh',
        overscrollBehavior: 'none',
      }}
    >
      {children}
    </div>
  );
}

'use client';

import dynamic from 'next/dynamic';

const VRViewer = dynamic(() => import('./VRViewer'), { ssr: false });

interface Props {
  src:       string;
  title?:    string;
  subtitle?: string;
  backHref?: string;
}

export default function VRViewerClient(props: Props) {
  return <VRViewer {...props} />;
}

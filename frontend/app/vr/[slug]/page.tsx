import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getProductBySlug, getPanoramaProducts } from '@/lib/sanity';

const VRViewer = dynamic(() => import('@/components/VRViewer'), { ssr: false });

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Not Found' };
  return {
    title: `${product.name} — 360° Tour | Innovation Designer Furniture`,
    description: `Explore the ${product.name} in an immersive 360° panoramic view.`,
  };
}

// ── Static params ─────────────────────────────────────────────────────────────

export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getPanoramaProducts();
  return products.map(p => ({
    slug: typeof p.slug === 'string' ? p.slug : p.slug.current,
  }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function VRProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.panorama_url) notFound();

  const categorySlug = product.category
    ? typeof product.category.slug === 'string'
      ? product.category.slug
      : product.category.slug.current
    : null;

  return (
    <div
      style={{
        height: '100dvh',
        overflow: 'hidden',
        background: '#0A0806',
        // Prevent iOS bounce / overscroll
        overscrollBehavior: 'none',
        position: 'fixed',
        inset: 0,
      }}
    >
      <VRViewer
        src={product.panorama_url}
        title={product.name}
        subtitle={categorySlug ? product.category?.name : undefined}
        backHref="/vr"
      />
    </div>
  );
}

"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Studio = NextStudio as any;
  return <Studio config={config} />;
}

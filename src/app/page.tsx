"use client";
import dynamic from "next/dynamic";

const AframeScene = dynamic(() => import('@/components/AframeScene'), { ssr: false });

export default function Page() {
  return <AframeScene />;
}

"use client";
import dynamic from 'next/dynamic';

const AframeScene = dynamic(() => import('./AframeScene'), { ssr: false });

export default function Scene() {
  return <AframeScene />;
}

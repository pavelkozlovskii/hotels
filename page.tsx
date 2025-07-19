"use client";
import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("./src/app/MapClient"), { ssr: false });

export default function Home() {
  return <MapClient />;
}

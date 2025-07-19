"use client";
import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("./MapClient"), { ssr: false });

export default function Home() {
  return <MapClient />;
}

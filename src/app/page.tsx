"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const HOTELS = [
  {
    id: 1,
    name: "Отель Северный",
    address: "ул. Ленина, 1",
    price: 3200,
    lat: 55.7522,
    lng: 37.6156,
  },
  {
    id: 2,
    name: "Гранд Отель",
    address: "пр. Мира, 10",
    price: 4500,
    lat: 55.7601,
    lng: 37.6189,
  },
  {
    id: 3,
    name: "Отель Центр",
    address: "ул. Пушкина, 5",
    price: 2800,
    lat: 55.7558,
    lng: 37.6173,
  },
  {
    id: 4,
    name: "Отель Восток",
    address: "ул. Восточная, 3",
    price: 3900,
    lat: 55.7517,
    lng: 37.6200,
  },
  {
    id: 5,
    name: "Отель Южный",
    address: "ул. Южная, 7",
    price: 3100,
    lat: 55.7489,
    lng: 37.6100,
  },
];

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371e3;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const hotelIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});
const highlightIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function HotelsList({ point }: { point: LatLngExpression }) {
  const [lat, lng] = point as [number, number];
  const sorted = [...HOTELS].sort(
    (a, b) =>
      getDistance(lat, lng, a.lat, a.lng) - getDistance(lat, lng, b.lat, b.lng)
  );
  return (
    <div style={{ marginTop: 24 }}>
      <h2 style={{ marginBottom: 12 }}>Ближайшие отели</h2>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {sorted.map((hotel) => (
          <li
            key={hotel.id}
            style={{
              marginBottom: 16,
              padding: 12,
              border: "1px solid #eee",
              borderRadius: 8,
              background: "#fafafa",
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ fontWeight: 600 }}>{hotel.name}</div>
            <div style={{ color: "#666", fontSize: 14 }}>{hotel.address}</div>
            <div style={{ color: "#1976d2", fontWeight: 500, marginTop: 4 }}>
              {hotel.price} ₽/ночь
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClickableMap({ onSelect }: { onSelect: (point: LatLngExpression) => void }) {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function Home() {
  const [selected, setSelected] = useState<LatLngExpression | null>(null);
  const center: LatLngExpression = [55.7558, 37.6173]; // Москва

  if (typeof window !== "undefined") {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }

  let nearestHotelId: number | null = null;
  if (selected) {
    const [lat, lng] = selected as [number, number];
    nearestHotelId = HOTELS.slice().sort(
      (a, b) => getDistance(lat, lng, a.lat, a.lng) - getDistance(lat, lng, b.lat, b.lng)
    )[0]?.id ?? null;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: 16 }}>
      <h1 style={{ margin: "24px 0 16px", fontSize: 28, textAlign: "center" }}>Интерактивная карта отелей</h1>
      <div style={{ width: "100%", maxWidth: 600, height: 400, position: "relative" }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ width: "100%", height: "100%", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickableMap onSelect={setSelected} />
          {HOTELS.map(hotel => (
            <Marker
              key={hotel.id}
              position={[hotel.lat, hotel.lng]}
              icon={hotel.id === nearestHotelId ? highlightIcon : hotelIcon}
            />
          ))}
          {selected && <Marker position={selected} />}
        </MapContainer>
      </div>
      {selected && <HotelsList point={selected} />}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Resort } from "@/types";
import Link from "next/link";

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface ResortMapProps {
  resorts: Resort[];
}

// Custom marker icon for resorts
const createCustomIcon = () => {
  if (typeof window !== "undefined") {
    return new Icon({
      iconUrl: "data:image/svg+xml;base64," + btoa(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="#2C3E50" stroke="white" stroke-width="3"/>
          <path d="M16 8 L20 16 L16 12 L12 16 Z" fill="white"/>
        </svg>
      `),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  }
  return undefined;
};

// Custom marker icon for user location
const createUserLocationIcon = () => {
  if (typeof window !== "undefined") {
    return new Icon({
      iconUrl: "data:image/svg+xml;base64," + btoa(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="10" fill="#20B2AA" stroke="white" stroke-width="3"/>
          <circle cx="16" cy="16" r="4" fill="white"/>
        </svg>
      `),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  }
  return undefined;
};

// Component to fit map bounds to all markers
function FitBounds({ resorts }: { resorts: Resort[] }) {
  const map = useMap();

  useEffect(() => {
    if (resorts.length > 0) {
      const bounds = new LatLngBounds(
        resorts.map((resort) => [resort.latitude, resort.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, resorts]);

  return null;
}

export default function ResortMap({ resorts }: ResortMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResorts, setFilteredResorts] = useState<Resort[]>(resorts);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResorts(resorts);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredResorts(
        resorts.filter(
          (resort) =>
            resort.name.toLowerCase().includes(query) ||
            resort.state.toLowerCase().includes(query) ||
            resort.country.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, resorts]);

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError("Unable to get your location");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError("Geolocation not supported");
    }
  };

  if (!isMounted) {
    return (
      <div className="w-full h-[500px] bg-slate-100 rounded-card border border-slate-200 flex items-center justify-center">
        <p className="text-slate-500">Loading map...</p>
      </div>
    );
  }

  const customIcon = createCustomIcon();
  const userLocationIcon = createUserLocationIcon();

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search resorts, states, countries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
        />
      </div>

      <div className="w-full h-[500px] rounded-card overflow-hidden shadow-sm">
        <MapContainer
          center={[44.5, -100]}
          zoom={4}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds resorts={filteredResorts} />
        {filteredResorts.map((resort) => (
          <Marker
            key={resort.id}
            position={[resort.latitude, resort.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-primary text-base mb-1">
                  {resort.name}
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  {resort.state}, {resort.country}
                </p>
                <p className="text-xs text-slate-500 mb-3">
                  Summit: {resort.elevations.summit.toLocaleString()} ft
                </p>
                <Link
                  href={`/resort/${resort.id}`}
                  className="text-sm font-medium text-accent hover:text-accent/80 inline-block"
                >
                  View Forecast →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-teal text-base mb-1">Your Location</h3>
                <p className="text-sm text-slate-600">
                  {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Location Button */}
      <button
        onClick={handleGetLocation}
        className="absolute top-4 right-4 z-[1000] bg-white hover:bg-slate-50 text-slate-700 p-3 rounded-lg shadow-lg border border-slate-300 transition-colors"
        title="Show my location"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
      </button>

        {locationError && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm">
            {locationError}
          </div>
        )}
      </div>
    </div>
  );
}

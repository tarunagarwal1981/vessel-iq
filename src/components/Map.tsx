'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  mapUrl: string;
}

const extractCoordinates = (mapUrl: string): { lat: number; lon: number } => {
  try {
    const urlParams = new URLSearchParams(mapUrl);
    const lat = parseFloat(urlParams.get('lat') || '0');
    const lon = parseFloat(urlParams.get('lon') || '0');
    
    if (isNaN(lat) || isNaN(lon)) {
      console.error('Invalid coordinates in URL');
      return { lat: 0, lon: 0 };
    }
    
    return { lat, lon };
  } catch (error) {
    console.error('Error extracting coordinates:', error);
    return { lat: 0, lon: 0 };
  }
};

const Map = ({ mapUrl }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const { lat, lon } = extractCoordinates(mapUrl);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    mapInstanceRef.current = L.map(mapRef.current).setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    L.marker([lat, lon]).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [mapUrl]);

  return (
    <div 
      ref={mapRef}
      className="map-container"
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '8px',
        margin: '10px 0'
      }}
    />
  );
};

export default Map;

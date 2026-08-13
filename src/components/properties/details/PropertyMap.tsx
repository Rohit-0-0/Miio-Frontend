'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { env } from '@/config/env';

interface PropertyMapProps {
  latitude?: number;
  longitude?: number;
  title?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.75rem',
};

const defaultCenter = {
  lat: 40.7128, // Default to NY or some placeholder if missing
  lng: -74.0060,
};

export function PropertyMap({ latitude, longitude, title }: PropertyMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  if (!latitude || !longitude) {
    return null;
  }

  const center = {
    lat: latitude,
    lng: longitude,
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">
        <span className="text-gray-400 font-serif">Loading map...</span>
      </div>
    );
  }

  return (
    <section className="py-12 border-b border-gray-100">
      <h2 className="text-2xl font-serif text-gray-900 mb-8">Location</h2>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        <Marker 
          position={center} 
          title={title || 'Property Location'}
        />
      </GoogleMap>
    </section>
  );
}

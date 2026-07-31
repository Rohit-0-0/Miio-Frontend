'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { propertyService } from '@/services/property.service';
import { PropertyData } from '@/types/property';
import Link from 'next/link';

const libraries: "places"[] = ["places"];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

export default function AdminMapsPage() {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await propertyService.list({ limit: 1000 });
        setProperties(response.data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loadError) return <div className="p-8">Error loading maps. Check API key.</div>;
  if (!isLoaded || isLoading) return <div className="p-8 flex items-center justify-center min-h-[50vh]">Loading...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-gray-50">
      
      {/* Future Sidebar Placeholder */}
      <div className="w-80 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0 z-10 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Property Maps</h1>
          <p className="text-sm text-gray-500 mt-1">Manage locations & clustering</p>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-sm text-gray-400 p-4 text-center border-2 border-dashed border-gray-200 rounded-sm">
            Filters and clustering controls will go here in the future.
          </div>
          <div className="mt-6 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 px-2">Properties ({properties.length})</h3>
            {properties.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProperty(p);
                  if (p.location?.latitude && p.location?.longitude && mapRef.current) {
                    mapRef.current.panTo({ lat: p.location.latitude, lng: p.location.longitude });
                    mapRef.current.setZoom(p.location.mapViewport?.zoom || 14);
                  }
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-sm transition-colors truncate"
              >
                {p.title}
                {(!p.location?.latitude || !p.location?.longitude) && (
                  <span className="ml-2 text-amber-500 text-xs">(No location)</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={2}
          center={defaultCenter}
          onLoad={onMapLoad}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {properties.map((property) => {
            if (property.location?.latitude && property.location?.longitude) {
              return (
                <Marker
                  key={property.id}
                  position={{ lat: property.location.latitude, lng: property.location.longitude }}
                  onClick={() => setSelectedProperty(property)}
                />
              );
            }
            return null;
          })}

          {selectedProperty && selectedProperty.location?.latitude && selectedProperty.location?.longitude && (
            <InfoWindow
              position={{ lat: selectedProperty.location.latitude, lng: selectedProperty.location.longitude }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-gray-900 mb-1">{selectedProperty.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{selectedProperty.location.city}, {selectedProperty.location.country}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    selectedProperty.lifecycleStatus === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedProperty.lifecycleStatus}
                  </span>
                  <Link 
                    href={`/admin/properties/${selectedProperty.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

    </div>
  );
}

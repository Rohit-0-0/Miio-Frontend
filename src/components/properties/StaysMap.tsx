'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { env } from '@/config/env';
import Link from 'next/link';

interface StaysMapProps {
  properties: any[];
  searchQueryString?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: 'calc(100vh - 8rem)', // Fallback min height
};

export function StaysMap({ properties, searchQueryString }: StaysMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);

  // Filter out properties without coordinates
  const validProperties = useMemo(() => {
    return properties.filter(
      (p) => p.address && typeof p.address.lat === 'number' && typeof p.address.lng === 'number'
    );
  }, [properties]);

  // Add a slight offset to identical coordinates so pins don't overlap completely
  const processedProperties = useMemo(() => {
    const coordsMap = new Map<string, number>();
    
    return validProperties.map((p) => {
      const lat = p.address.lat;
      const lng = p.address.lng;
      const key = `${lat},${lng}`;
      
      const count = coordsMap.get(key) || 0;
      coordsMap.set(key, count + 1);
      
      // Offset by approx ~15 meters diagonally for each duplicate
      const offsetLat = lat + (count > 0 ? (count * 0.00015) : 0);
      const offsetLng = lng + (count > 0 ? (count * 0.00015) : 0);
      
      return {
        ...p,
        displayLat: offsetLat,
        displayLng: offsetLng
      };
    });
  }, [validProperties]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Fit bounds when map loads or properties change
  React.useEffect(() => {
    if (map && processedProperties.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      let hasValidBounds = false;
      
      processedProperties.forEach((p) => {
        if (p.displayLat && p.displayLng) {
          bounds.extend({ lat: p.displayLat, lng: p.displayLng });
          hasValidBounds = true;
        }
      });
      
      if (hasValidBounds) {
        map.fitBounds(bounds);
        // Prevent zooming in too close if there's only one property
        if (processedProperties.length === 1) {
          const listener = window.google.maps.event.addListener(map, "idle", function() { 
            if (map.getZoom()! > 14) map.setZoom(14); 
            window.google.maps.event.removeListener(listener); 
          });
        }
      }
    }
  }, [map, processedProperties]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full min-h-[calc(100vh-8rem)] bg-gray-100 animate-pulse flex items-center justify-center">
        <span className="text-gray-400 font-serif">Loading map...</span>
      </div>
    );
  }

  // Default to Sydney if no properties
  const defaultCenter = { lat: -33.8688, lng: 151.2093 };
  const center = processedProperties.length > 0
    ? { lat: processedProperties[0].displayLat, lng: processedProperties[0].displayLng } 
    : defaultCenter;

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {processedProperties.map((property) => {
          const lat = property.displayLat;
          const lng = property.displayLng;
          
          return (
            <Marker
              key={property._id || property.id}
              position={{ lat, lng }}
              onClick={() => setSelectedProperty(property)}
            />
          );
        })}

        {selectedProperty && (
          <InfoWindow
            position={{
              lat: selectedProperty.displayLat,
              lng: selectedProperty.displayLng,
            }}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div className="max-w-[200px] sm:max-w-[250px] bg-white overflow-hidden rounded-md">
              <Link 
                href={`/properties/${selectedProperty._id || selectedProperty.id}${searchQueryString ? `?${searchQueryString}` : ''}`}
                className="block group"
              >
                <div className="relative w-full h-32 bg-gray-200">
                  {selectedProperty.picture?.large || selectedProperty.picture?.regular || selectedProperty.pictures?.[0]?.original ? (
                    <img 
                      src={selectedProperty.picture?.large || selectedProperty.picture?.regular || selectedProperty.pictures?.[0]?.original}
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span>No image</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-serif text-sm font-semibold text-gray-900 line-clamp-1 mb-1 group-hover:text-gray-600 transition-colors">
                    {selectedProperty.nickname || selectedProperty.title}
                  </h3>
                  <div className="text-xs text-gray-500 mb-2">
                    {selectedProperty.accommodates || 2} Guests • {selectedProperty.bedrooms || 1} Beds
                  </div>
                  <div className="font-medium text-sm text-gray-900">
                    {selectedProperty.prices?.totalPrice ? (
                      <>${selectedProperty.prices.totalPrice} total</>
                    ) : selectedProperty.prices?.basePrice ? (
                      <>${selectedProperty.prices.basePrice} / night</>
                    ) : (
                      'Enquire'
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

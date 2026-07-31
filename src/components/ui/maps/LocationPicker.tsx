'use client';

import React, { useCallback, useRef } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { Search, MapPin } from 'lucide-react';

const libraries: "places"[] = ["places"];

export interface LocationData {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  source: 'manual';
  mapViewport?: {
    zoom?: number;
  };
}

interface LocationPickerProps {
  value?: LocationData;
  onChange: (value: LocationData) => void;
  className?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.375rem',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060, // NYC
};

export function LocationPicker(props: LocationPickerProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  if (loadError) return <div>Error loading maps. Check your API key.</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return <LocationPickerInner {...props} />;
}

function LocationPickerInner({ value, onChange, className = '' }: LocationPickerProps) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const {
    ready,
    value: searchValue,
    suggestions: { status, data },
    setValue: setSearchValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const handleSelect = async (address: string, placeId?: string) => {
    setSearchValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      
      handleGeocodeResult(results[0], lat, lng, placeId);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleGeocodeResult = (
    result: google.maps.GeocoderResult, 
    lat: number, 
    lng: number, 
    placeId?: string
  ) => {
    let city = '';
    let state = '';
    let country = '';
    let postalCode = '';
    
    // Parse address components
    for (const component of result.address_components) {
      const types = component.types;
      if (types.includes('locality') || types.includes('postal_town')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      } else if (types.includes('postal_code')) {
        postalCode = component.long_name;
      }
    }

    // Fallback for city
    if (!city) {
      const sublocal = result.address_components.find(c => c.types.includes('sublocality') || c.types.includes('neighborhood'));
      if (sublocal) city = sublocal.long_name;
    }

    onChange({
      address: result.formatted_address,
      city,
      state,
      country,
      postalCode,
      latitude: lat,
      longitude: lng,
      placeId: placeId || result.place_id,
      source: 'manual',
      mapViewport: { zoom: mapRef.current?.getZoom() || 15 }
    });

    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(15);
    }
  };

  const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    try {
      const results = await getGeocode({ location: { lat, lng } });
      if (results[0]) {
        handleGeocodeResult(results[0], lat, lng);
        setSearchValue(results[0].formatted_address, false);
      } else {
        // Just update coords if reverse geocode fails
        onChange({
          ...(value as LocationData),
          latitude: lat,
          longitude: lng,
        });
      }
    } catch (error) {
      console.error("Reverse geocoding error: ", error);
      onChange({
        ...(value as LocationData),
        latitude: lat,
        longitude: lng,
      });
    }
  };

  // Sync manual input changes
  const handleManualChange = (field: keyof LocationData, val: string | number) => {
    if (!value) return;
    onChange({ ...value, [field]: val });
  };

  const center = value?.latitude && value?.longitude 
    ? { lat: value.latitude, lng: value.longitude } 
    : defaultCenter;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          disabled={!ready}
          placeholder="Search for an address..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm focus:ring-gray-900 focus:border-gray-900"
        />
        {status === "OK" && (
          <ul className="absolute z-10 w-full bg-white mt-1 border border-gray-200 rounded-sm shadow-lg max-h-60 overflow-auto">
            {data.map(({ place_id, description }) => (
              <li
                key={place_id}
                onClick={() => handleSelect(description, place_id)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-sm"
              >
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map */}
      <div className="border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={value?.mapViewport?.zoom || 13}
          center={center}
          onLoad={onMapLoad}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {value?.latitude && value?.longitude && (
            <Marker
              position={{ lat: value.latitude, lng: value.longitude }}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
          )}
        </GoogleMap>
      </div>

      {/* Manual Overrides */}
      {value && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 mt-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Formatted Address</label>
            <input
              type="text"
              value={value.address || ''}
              onChange={(e) => handleManualChange('address', e.target.value)}
              className="w-full text-sm rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">City</label>
            <input
              type="text"
              value={value.city || ''}
              onChange={(e) => handleManualChange('city', e.target.value)}
              className="w-full text-sm rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">State / Province</label>
            <input
              type="text"
              value={value.state || ''}
              onChange={(e) => handleManualChange('state', e.target.value)}
              className="w-full text-sm rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Country</label>
            <input
              type="text"
              value={value.country || ''}
              onChange={(e) => handleManualChange('country', e.target.value)}
              className="w-full text-sm rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Postal Code</label>
            <input
              type="text"
              value={value.postalCode || ''}
              onChange={(e) => handleManualChange('postalCode', e.target.value)}
              className="w-full text-sm rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Latitude</label>
            <input
              type="number"
              value={value.latitude || ''}
              onChange={(e) => handleManualChange('latitude', parseFloat(e.target.value))}
              className="w-full text-sm rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Longitude</label>
            <input
              type="number"
              value={value.longitude || ''}
              onChange={(e) => handleManualChange('longitude', parseFloat(e.target.value))}
              className="w-full text-sm rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 bg-gray-100"
              disabled
            />
          </div>
        </div>
      )}
    </div>
  );
}

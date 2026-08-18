import React, { useCallback, useEffect, useState } from 'react';
import { ArrayOfPrimitivesInputProps, set, unset } from 'sanity';
import { Box, Card, Flex, Stack, Text, Checkbox, Spinner, TextInput } from '@sanity/ui';

interface Property {
  id: string;
  title: string;
  city: string;
  country: string;
}

export function PropertySelector(props: ArrayOfPrimitivesInputProps) {
  const { value = [], onChange } = props;
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Normalize API URL from environment, fallback to localhost for development if missing
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    async function fetchProperties() {
      try {
        setError(null);
        const res = await fetch(`${API_URL}/booking/search`);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const json = await res.json();
        if (json.data) {
          const mapped = json.data.map((p: any) => ({
            id: p._id || p.id,
            title: p.nickname || p.title || 'Unknown',
            city: p.address?.city || '',
            country: p.address?.country || '',
          }));
          setProperties(mapped);
        }
      } catch (err: any) {
        console.error('Failed to fetch properties:', err);
        setError(err.message || 'Failed to load properties from backend.');
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, [API_URL]);

  const handleToggle = useCallback(
    (propertyId: string, isChecked: boolean) => {
      const currentValue = (value as any[]) || [];
      let newValue = [...currentValue];

      if (isChecked) {
        if (!newValue.some(item => typeof item === 'object' ? item.propertyId === propertyId : item === propertyId)) {
          // Add object with _key and propertyId
          newValue.push({
            _key: Math.random().toString(36).substring(2, 9),
            propertyId: propertyId
          });
        }
      } else {
        newValue = newValue.filter((item) => {
          if (typeof item === 'object') return item.propertyId !== propertyId;
          return item !== propertyId;
        });
      }

      onChange(newValue.length > 0 ? set(newValue) : unset());
    },
    [value, onChange]
  );

  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card padding={3} radius={2} shadow={1} border>
      <Stack style={{ gap: '1rem' }}>
        <Box>
          <Text weight="semibold" size={1}>
            Select properties to feature
          </Text>
          <Text size={1} muted style={{ marginTop: '0.5rem' }}>
            Fetching from: {API_URL}
          </Text>
        </Box>

        <TextInput
          placeholder="Search properties by name or city..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />

        {loading ? (
          <Flex align="center" justify="center" padding={4}>
            <Spinner />
          </Flex>
        ) : error ? (
          <Card padding={3} radius={2} tone="critical" border>
            <Text size={1} weight="medium">
              Error: {error}
            </Text>
            <Text size={1} muted style={{ marginTop: '0.5rem' }}>
              Check your backend server or console logs.
            </Text>
          </Card>
        ) : (
          <Box style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <Stack style={{ gap: '0.75rem' }}>
              {filteredProperties.length === 0 ? (
                <Text size={1} muted>
                  No properties found.
                </Text>
              ) : (
                filteredProperties.map((property) => {
                  const isChecked = (value as any[]).some(item => typeof item === 'object' ? item.propertyId === property.id : item === property.id);
                  return (
                    <Card key={property.id} padding={2} radius={2} border>
                      <Flex align="center" gap={3}>
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) => handleToggle(property.id, e.currentTarget.checked)}
                        />
                        <Stack style={{ gap: '0.5rem' }}>
                          <Text weight="medium">{property.title}</Text>
                          <Text size={1} muted>
                            {property.city}, {property.country} ({property.id})
                          </Text>
                        </Stack>
                      </Flex>
                    </Card>
                  );
                })
              )}
            </Stack>
          </Box>
        )}
      </Stack>
    </Card>
  );
}

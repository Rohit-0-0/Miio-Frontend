import React, { useCallback, useEffect, useState } from 'react';
import { StringInputProps, set, unset } from 'sanity';
import { Box, Card, Flex, Stack, Text, Radio, Spinner, TextInput } from '@sanity/ui';

interface Property {
  id: string;
  title: string;
  city: string;
  country: string;
}

export function SinglePropertySelector(props: StringInputProps) {
  const { value, onChange } = props;
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

  const handleSelect = useCallback(
    (propertyId: string) => {
      // If clicking the already selected one, unselect it
      if (value === propertyId) {
        onChange(unset());
      } else {
        onChange(set(propertyId));
      }
    },
    [value, onChange]
  );

  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.city.toLowerCase().includes(search.toLowerCase()) ||
    p.id.includes(search)
  );

  return (
    <Card padding={3} radius={2} shadow={1} border>
      <Stack style={{ gap: '1rem' }}>
        <Box>
          <Text weight="semibold" size={1}>
            Select a Guesty Property
          </Text>
          <Text size={1} muted style={{ marginTop: '0.5rem' }}>
            Choose the specific property this editorial belongs to.
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
                  const isChecked = value === property.id;
                  return (
                    <Card 
                      key={property.id} 
                      padding={2} 
                      radius={2} 
                      border 
                      tone={isChecked ? 'primary' : 'default'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSelect(property.id)}
                    >
                      <Flex align="center" gap={3}>
                        <Radio
                          checked={isChecked}
                          readOnly
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

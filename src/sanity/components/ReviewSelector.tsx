import React, { useCallback, useEffect, useState } from 'react';
import { ArrayOfObjectsInputProps, set, unset } from 'sanity';
import { Box, Card, Flex, Stack, Text, Checkbox, Spinner, TextInput, Button } from '@sanity/ui';
import { env } from '@/config/env';

interface ReviewItem {
  id: string;
  listingId: string;
  quote: string;
  author: string;
  date: string;
  source: string;
  rating: number;
}

type FeaturedValue = {
  _key?: string;
  reviewId?: string;
  listingId?: string;
};

const PAGE_SIZE = 20;

export function ReviewSelector(props: ArrayOfObjectsInputProps) {
  const { value = [], onChange } = props;
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const API_URL = env.NEXT_PUBLIC_API_URL;

  const fetchPage = useCallback(
    async (nextSkip: number, append: boolean) => {
      try {
        setError(null);
        if (append) setLoadingMore(true);
        else setLoading(true);

        const res = await fetch(
          `${API_URL}/reviews?limit=${PAGE_SIZE}&skip=${nextSkip}`
        );
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const json = await res.json();
        const mapped: ReviewItem[] = (json.data || []).map((r: any) => ({
          id: r.id,
          listingId: r.listingId || '',
          quote: r.quote || '',
          author: r.author || 'Guest',
          date: r.date || '',
          source: r.source || '',
          rating: r.rating || 5,
        }));

        setReviews((prev) => (append ? [...prev, ...mapped] : mapped));
        setSkip(nextSkip);
        const count = json.pagination?.count;
        const pageLen = mapped.length;
        setHasMore(
          typeof count === 'number'
            ? nextSkip + pageLen < count
            : pageLen >= PAGE_SIZE
        );
      } catch (err: any) {
        console.error('Failed to fetch Guesty reviews:', err);
        setError(err.message || 'Failed to load reviews from backend.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [API_URL]
  );

  useEffect(() => {
    fetchPage(0, false);
  }, [fetchPage]);

  const selected = (value as FeaturedValue[]) || [];

  const handleToggle = useCallback(
    (review: ReviewItem, isChecked: boolean) => {
      let newValue = [...selected];

      if (isChecked) {
        if (!newValue.some((item) => item.reviewId === review.id)) {
          newValue.push({
            _key: Math.random().toString(36).substring(2, 11),
            reviewId: review.id,
            listingId: review.listingId,
          });
        }
      } else {
        newValue = newValue.filter((item) => item.reviewId !== review.id);
      }

      onChange(newValue.length > 0 ? set(newValue) : unset());
    },
    [selected, onChange]
  );

  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.author.toLowerCase().includes(q) ||
      r.quote.toLowerCase().includes(q) ||
      r.listingId.toLowerCase().includes(q) ||
      r.source.toLowerCase().includes(q)
    );
  });

  return (
    <Card padding={3} radius={2} shadow={1} border>
      <Stack style={{ gap: '1rem' }}>
        <Box>
          <Text weight="semibold" size={1}>
            Select reviews to feature on homepage
          </Text>
          <Text size={1} muted style={{ marginTop: '0.5rem' }}>
            Fetching from: {API_URL}/reviews (Guesty)
          </Text>
        </Box>

        <TextInput
          placeholder="Search by guest, quote, listing ID, or source..."
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
              Check your backend server is running on port 8000.
            </Text>
          </Card>
        ) : (
          <Box style={{ maxHeight: '360px', overflowY: 'auto' }}>
            <Stack style={{ gap: '0.75rem' }}>
              {filtered.length === 0 ? (
                <Text size={1} muted>
                  No reviews found.
                </Text>
              ) : (
                filtered.map((review) => {
                  const isChecked = selected.some((item) => item.reviewId === review.id);
                  return (
                    <Card key={review.id} padding={2} radius={2} border>
                      <Flex align="flex-start" gap={3}>
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) =>
                            handleToggle(review, e.currentTarget.checked)
                          }
                          style={{ marginTop: '2px' }}
                        />
                        <Stack style={{ gap: '0.35rem', flex: 1 }}>
                          <Text weight="medium">
                            {review.author}
                            {review.date ? ` · ${review.date}` : ''}
                            {review.rating ? ` · ${review.rating}/5` : ''}
                          </Text>
                          <Text size={1} muted>
                            {review.quote.length > 160
                              ? `${review.quote.slice(0, 160)}...`
                              : review.quote}
                          </Text>
                          <Text size={0} muted>
                            {review.source}
                            {review.listingId ? ` · ${review.listingId}` : ''}
                          </Text>
                        </Stack>
                      </Flex>
                    </Card>
                  );
                })
              )}

              {hasMore && !search && (
                <Button
                  mode="ghost"
                  text={loadingMore ? 'Loading...' : 'Load more reviews'}
                  disabled={loadingMore}
                  onClick={() => fetchPage(skip + PAGE_SIZE, true)}
                />
              )}
            </Stack>
          </Box>
        )}

        <Text size={1} muted>
          {selected.length} review{selected.length === 1 ? '' : 's'} selected for homepage
        </Text>
      </Stack>
    </Card>
  );
}
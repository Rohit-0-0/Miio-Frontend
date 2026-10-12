import React, { useCallback, useEffect, useState } from 'react';
import { ArrayOfObjectsInputProps, set, unset, useFormValue } from 'sanity';
import { Box, Card, Flex, Stack, Text, Checkbox, Spinner, TextInput, Badge, Button } from '@sanity/ui';
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

export type SelectedReviewValue = {
  _key?: string;
  reviewId: string;
  quote: string;
  author: string;
  date?: string;
  rating?: number;
  source?: string;
};

const PAGE_SIZE = 20;

export function ListingReviewSelector(props: ArrayOfObjectsInputProps) {
  const { value = [], onChange } = props;
  const guestyListingId = useFormValue(['guestyListingId']) as string | undefined;

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const API_URL = env.NEXT_PUBLIC_API_URL;

  const fetchReviewsPage = useCallback(
    async (nextSkip: number, append: boolean) => {
      if (!guestyListingId) return;

      try {
        setError(null);
        if (append) setLoadingMore(true);
        else setLoading(true);

        const res = await fetch(
          `${API_URL}/reviews?listingId=${guestyListingId}&limit=${PAGE_SIZE}&skip=${nextSkip}`
        );
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        const json = await res.json();
        const rawList = Array.isArray(json.data) ? json.data : [];

        const mapped: ReviewItem[] = rawList.map((r: any) => ({
          id: r.id || r._id,
          listingId: r.listingId || guestyListingId,
          quote: r.quote || r.publicReview || '',
          author: r.author || r.reviewer?.firstName || 'Guest',
          date: r.date || r.createdAtGuesty || r.createdAt || '',
          source: r.source || r.channel || 'Guesty',
          rating: r.rating || 5,
        }));

        setReviews((prev) => (append ? [...prev, ...mapped] : mapped));
        setSkip(nextSkip);

        const count = json.pagination?.count;
        if (typeof count === 'number') {
          setTotalCount(count);
          setHasMore(nextSkip + mapped.length < count);
        } else {
          setHasMore(mapped.length >= PAGE_SIZE);
        }
      } catch (err: any) {
        console.error('Failed to fetch reviews for listing:', err);
        setError(err.message || 'Failed to load listing reviews.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [API_URL, guestyListingId]
  );

  useEffect(() => {
    if (!guestyListingId) {
      setReviews([]);
      setLoading(false);
      setError(null);
      setSkip(0);
      setHasMore(false);
      setTotalCount(null);
      return;
    }

    setReviews([]);
    setSkip(0);
    fetchReviewsPage(0, false);
  }, [guestyListingId, fetchReviewsPage]);

  const selected = (value as SelectedReviewValue[]) || [];
  const selectedCount = selected.length;

  const handleToggle = useCallback(
    (review: ReviewItem, isChecked: boolean) => {
      let newValue = [...selected];

      if (isChecked) {
        if (!newValue.some((item) => item.reviewId === review.id)) {
          newValue.push({
            _key: Math.random().toString(36).substring(2, 11),
            reviewId: review.id,
            quote: review.quote,
            author: review.author,
            date: review.date,
            rating: review.rating,
            source: review.source,
          });
        }
      } else {
        newValue = newValue.filter((item) => item.reviewId !== review.id);
      }

      onChange(newValue.length > 0 ? set(newValue) : unset());
    },
    [selected, onChange]
  );

  if (!guestyListingId) {
    return (
      <Card padding={3} tone="caution" radius={2} border>
        <Stack style={{ gap: '0.5rem' }}>
          <Text weight="semibold" size={1}>
            No Guesty Listing ID Selected
          </Text>
          <Text size={1} muted>
            Please select a Guesty Listing ID in the field above to view and select reviews for this property.
          </Text>
        </Stack>
      </Card>
    );
  }

  const filteredReviews = reviews.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.quote.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q) ||
      r.source.toLowerCase().includes(q)
    );
  });

  return (
    <Card padding={3} radius={2} border>
      <Stack style={{ gap: '0.75rem' }}>
        <Flex gap={2} align="center" justify="space-between">
          <Box style={{ flex: 1 }}>
            <TextInput
              placeholder="Filter listing reviews..."
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
            />
          </Box>
          <Flex gap={2} align="center">
            {totalCount !== null && (
              <Text size={1} muted>
                Total: {totalCount}
              </Text>
            )}
            <Badge tone={selectedCount > 0 ? 'positive' : 'default'} fontSize={1}>
              Selected: {selectedCount}
            </Badge>
          </Flex>
        </Flex>

        {loading ? (
          <Flex align="center" justify="center" padding={4}>
            <Spinner />
          </Flex>
        ) : error ? (
          <Card padding={3} tone="critical" radius={2} border>
            <Text size={1}>{error}</Text>
          </Card>
        ) : filteredReviews.length === 0 ? (
          <Card padding={3} tone="transparent">
            <Text size={1} muted>
              {reviews.length === 0
                ? 'No reviews found for this listing in Guesty.'
                : 'No reviews match your search filter.'}
            </Text>
          </Card>
        ) : (
          <Box style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Stack style={{ gap: '0.5rem' }}>
              {filteredReviews.map((review) => {
                const isChecked = selected.some((item) => item.reviewId === review.id);

                return (
                  <Card
                    key={review.id}
                    padding={3}
                    radius={2}
                    tone={isChecked ? 'primary' : 'default'}
                    border
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.15s ease-in-out',
                    }}
                    onClick={() => handleToggle(review, !isChecked)}
                  >
                    <Flex gap={3} align="flex-start">
                      <Box style={{ paddingTop: '2px' }}>
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) => handleToggle(review, e.currentTarget.checked)}
                        />
                      </Box>
                      <Stack style={{ gap: '0.35rem', flex: 1 }}>
                        <Flex align="center" justify="space-between">
                          <Text weight="medium">
                            {review.author}
                            {review.rating ? ` · ★ ${review.rating}` : ''}
                          </Text>
                          <Text size={0} muted>
                            {review.date ? new Date(review.date).toLocaleDateString() : ''}{' '}
                            {review.source ? `(${review.source})` : ''}
                          </Text>
                        </Flex>
                        <Text size={1} muted style={{ fontStyle: 'italic' }}>
                          &ldquo;{review.quote}&rdquo;
                        </Text>
                      </Stack>
                    </Flex>
                  </Card>
                );
              })}

              {hasMore && !search && (
                <Box style={{ paddingTop: '0.5rem' }}>
                  <Button
                    mode="ghost"
                    text={loadingMore ? 'Loading more reviews...' : 'Load more reviews'}
                    disabled={loadingMore}
                    onClick={() => fetchReviewsPage(skip + PAGE_SIZE, true)}
                    style={{ width: '100%' }}
                  />
                </Box>
              )}
            </Stack>
          </Box>
        )}

        <Text size={1} muted>
          {selectedCount} review{selectedCount === 1 ? '' : 's'} selected for this property
        </Text>
      </Stack>
    </Card>
  );
}

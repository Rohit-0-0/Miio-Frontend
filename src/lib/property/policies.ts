import type { PropertyDetails } from '@/types/property';

type PolicyPage = 'house-rules' | 'cancellation-policy';

type PolicyProperty = Pick<PropertyDetails, 'slug' | 'guestyId' | 'id'> & {
  _id?: string;
  editorial?: PropertyDetails['editorial'];
};

export function propertyPolicyHref(property: PolicyProperty | undefined | null, page: PolicyPage): string {
  const listingId = property?.guestyId || property?._id || property?.id;
  const query = listingId ? `?id=${encodeURIComponent(listingId)}` : '';
  return `/properties/${property?.slug || listingId}/${page}${query}`;
}

export function cancellationSummary(property: PolicyProperty | undefined | null, fallback?: string): string {
  return (
    property?.editorial?.cancellationPolicy?.summary ||
    fallback ||
    'Free cancellation until 7 days before check-in.'
  );
}

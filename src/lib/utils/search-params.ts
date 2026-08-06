import { JournalQuery } from '@/types/journal';

export function normalizeString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0] || undefined;
  return value || undefined;
}

export function normalizeNumber(
  value: string | string[] | undefined,
  defaultValue?: number
): number | undefined {
  const str = normalizeString(value);
  if (!str) return defaultValue;
  const num = parseInt(str, 10);
  return isNaN(num) ? defaultValue : num;
}

export function normalizeBoolean(
  value: string | string[] | undefined
): boolean | undefined {
  const str = normalizeString(value);
  if (str === 'true') return true;
  if (str === 'false') return false;
  return undefined;
}

export function normalizeJournalQuery(
  searchParams: Record<string, string | string[] | undefined>
): JournalQuery {
  const query: JournalQuery = {
    page: normalizeNumber(searchParams.page, 1),
    limit: normalizeNumber(searchParams.limit, 12),
    search: normalizeString(searchParams.search),
    category: normalizeString(searchParams.category),
    featured: normalizeBoolean(searchParams.featured),
  };

  const sortRaw = normalizeString(searchParams.sort);
  if (sortRaw === 'publishedAt' || sortRaw === 'createdAt' || sortRaw === 'updatedAt' || sortRaw === 'title') {
    query.sort = sortRaw;
  }
  
  const orderRaw = normalizeString(searchParams.order);
  if (orderRaw === 'asc' || orderRaw === 'desc') {
    query.order = orderRaw;
  }
  return query;
}
export function normalizePropertyQuery(
  searchParams: Record<string, string | string[] | undefined>
) {
  const query: Record<string, string | number | boolean | undefined> = {
    page: normalizeNumber(searchParams.page, 1),
    limit: normalizeNumber(searchParams.limit, 10),
    search: normalizeString(searchParams.search),
    status: normalizeString(searchParams.status),
    propertyType: normalizeString(searchParams.propertyType),
    featured: normalizeBoolean(searchParams.featured),
    country: normalizeString(searchParams.country),
    city: normalizeString(searchParams.city),
    checkIn: normalizeString(searchParams.checkIn),
    checkOut: normalizeString(searchParams.checkOut),
    guests: normalizeNumber(searchParams.guests),
  };

  const sortRaw = normalizeString(searchParams.sort);
  if (sortRaw === 'sortOrder' || sortRaw === 'createdAt' || sortRaw === 'updatedAt' || sortRaw === 'title') {
    query.sort = sortRaw;
  }
  
  const orderRaw = normalizeString(searchParams.order);
  if (orderRaw === 'asc' || orderRaw === 'desc') {
    query.order = orderRaw;
  }

  return query;
}

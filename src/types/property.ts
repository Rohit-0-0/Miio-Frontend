import { BaseEntity, ImageAsset } from './common';

export const LIFECYCLE_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type LifecycleStatus = typeof LIFECYCLE_STATUS[keyof typeof LIFECYCLE_STATUS];

export const PROPERTY_TYPES = {
  APARTMENT: 'Apartment',
  VILLA: 'Villa',
  CABIN: 'Cabin',
  HOUSE: 'House',
  STUDIO: 'Studio',
  RESORT: 'Resort',
  PENTHOUSE: 'Penthouse',
} as const;

export type PropertyType = typeof PROPERTY_TYPES[keyof typeof PROPERTY_TYPES];

export const SYNC_PROVIDERS = {
  GUESTY: 'GUESTY',
  NONE: 'NONE',
} as const;

export type SyncProvider = typeof SYNC_PROVIDERS[keyof typeof SYNC_PROVIDERS];

export const SYNC_STATUS = {
  SYNCED: 'SYNCED',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
  UNLINKED: 'UNLINKED',
} as const;

export type SyncStatus = typeof SYNC_STATUS[keyof typeof SYNC_STATUS];

export interface Amenity {
  id: string;
  label: string;
  icon?: string;
  category?: string;
}

export interface SyncMetadata {
  provider: SyncProvider;
  status: SyncStatus;
  lastSyncedAt?: string;
  lastError?: string;
  version?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface MiioStandard {
  icon: string;
  title: string;
  description: string;
}

export interface RelatedPropertiesSettings {
  displayMode: 'AUTO' | 'MANUAL' | 'OFF';
  properties: string[]; 
}

export interface PropertyEditorialData {
  guestyListingId: string;
  description: string;
  experience: string;
  miioStandard: MiioStandard[];
  faq: FAQ[];
  featuredAmenityIds: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  relatedProperties: RelatedPropertiesSettings;
}

export const DEFAULT_PROPERTY_EDITORIAL: PropertyEditorialData = {
  guestyListingId: '',
  description: '',
  experience: '',
  miioStandard: [],
  faq: [],
  featuredAmenityIds: [],
  seo: {
    title: '',
    description: '',
    keywords: [],
  },
  relatedProperties: {
    displayMode: 'OFF',
    properties: [],
  },
};

export interface PropertyData {
  id: string;
  guestyId?: string;
  title: string;
  slug: string;
  shortDescription?: string;
  longDescription?: string;
  location?: {
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
  };
  gallery?: ImageAsset[];
  coverImageId?: string;
  propertyType: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  beds?: number;
  amenities?: Amenity[];
  minimumStay?: number;
  maximumStay?: number;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  instantBook?: boolean;
  lifecycleStatus: LifecycleStatus;
  featured?: boolean;
  active?: boolean;
  visibleOnWebsite?: boolean;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: ImageAsset;
  metaRobots?: string;
  sync?: SyncMetadata;
  editorial?: PropertyEditorialData;
  deletedAt?: string;
}

export interface PropertyDocument extends PropertyData, BaseEntity {}

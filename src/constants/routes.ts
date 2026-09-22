export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  JOURNAL: '/journal',
  PROPERTIES: '/properties',
  LOCATIONS: '/locations',
  PARTNERS: '/partners', // keeping for backend logic if any, but removing from nav
  BOOKING: '/booking',
  LOGIN: '/login',
  ADMIN: '/admin',
} as const;

export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export const NAVIGATION: NavItem[] = [
  { label: 'STAYS', href: ROUTES.PROPERTIES },
  { label: 'LOCATIONS', href: ROUTES.LOCATIONS },
  { label: 'JOURNAL', href: ROUTES.JOURNAL },
  { label: 'ABOUT', href: ROUTES.ABOUT },
];

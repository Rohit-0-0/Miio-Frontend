export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  JOURNAL: '/journal',
  PARTNERS: '/partners',
  BOOKING: '/booking',
  LOGIN: '/login',
  ADMIN: '/admin',
} as const;

export const NAVIGATION = [
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'Journal', href: ROUTES.JOURNAL },
  { label: 'Partners', href: ROUTES.PARTNERS },
];

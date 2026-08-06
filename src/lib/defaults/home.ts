export const HOME_DEFAULTS = {
  hero: {
    eyebrow: 'Welcome to Miio',
    title: 'Spaces designed for slow mornings...',
    subtitle: 'Experience the perfect blend of luxury, comfort, and thoughtful design in our curated properties.',
    backgroundImage: { assetId: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80' },
    cta: {
      text: 'Explore Stays',
      href: '/properties',
    }
  },
  featuredProperties: {
    heading: 'Featured Properties',
  },
  editorialStatement: {
    heading: 'A curated collection of homes that feel like a retreat.',
    description: 'We believe that travel should be more than just a place to sleep. It should be an experience that grounds you. Our properties are hand-picked for their unique character, premium design, and ability to connect you with the essentials of living well.',
    cta: {
      text: 'View All',
      href: '/properties',
    }
  },
  locations: {
    heading: 'Discover Our Locations',
    items: [
      {
        id: '1',
        name: 'Bondi',
        description: 'Sun-drenched beaches and vibrant coastal living.',
        ctaText: 'Explore Bondi',
        ctaLink: '/locations/bondi',
      },
      {
        id: '2',
        name: 'Vaucluse',
        description: 'Exclusive harbor views and tranquil luxury.',
        ctaText: 'Explore Vaucluse',
        ctaLink: '/locations/vaucluse',
      },
      {
        id: '3',
        name: 'Paddington',
        description: 'Heritage charm meets boutique elegance.',
        ctaText: 'Explore Paddington',
        ctaLink: '/locations/paddington',
      },
    ] as any[]
  },
  trust: {
    heading: 'The Miio Standard',
    rating: '4.9',
    reviewCount: '200+',
    verifiedText: 'Verified Stays',
    items: [
      { id: '1', title: 'Premium Design', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' },
      { id: '2', title: 'Curated Amenities', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' },
      { id: '3', title: '24/7 Concierge', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' },
    ] as any[]
  },
  journal: {
    heading: 'The Journal',
    ctaText: 'View All Articles',
    ctaLink: '/journal',
  },
  finalCta: {
    heading: 'Ready for your next retreat?',
    description: 'Explore our hand-picked collection of premium stays and experience the Miio standard for yourself.',
    buttonText: 'Book a Stay',
    buttonLink: '/properties',
  }
};

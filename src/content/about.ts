export interface AboutContent {
  hero: {
    titleLines: string[];
    subtitle: string;
  };
  intro: {
    label: string;
    body: string;
  };
  story: {
    label: string;
    headingLines: string[];
    paragraphs: string[];
    image: string;
    imageAlt: string;
  };
  pullQuote: {
    text: string;
  };
  philosophy: {
    label: string;
    heading: string;
    paragraphs: string[];
  };
  closing: {
    body: string;
    cta: {
      text: string;
      href: string;
    };
  };
}

// TODO: Replace ABOUT_CONTENT with Editorial CMS data once the content architecture (Sanity Studio vs Custom Admin) is finalized.
export const ABOUT_CONTENT: AboutContent = {
  hero: {
    titleLines: ['BUILD TRUST', 'THROUGH', 'STORY.'],
    subtitle: 'A new standard in boutique hospitality, rooted in family, design, and connection.',
  },
  intro: {
    label: '(01) Intro',
    body: 'Miio is a boutique hospitality brand built on thoughtful design, warm service, and a belief that where you stay shapes how you experience a place.',
  },
  story: {
    label: '(02) Our Story',
    headingLines: ['Three Sisters.', 'One Vision.'],
    paragraphs: [
      'We grew up traveling together, constantly observing the subtle details that turn a simple room into a memorable sanctuary.',
      'Our background in design, real estate, and hospitality converged into a shared purpose: to create spaces that feel like home, but with the refined touch of a boutique hotel.',
      'Miio exists to bridge the gap between impersonal luxury and inconsistent vacation rentals. We curate and design homes that foster connection, inspire calm, and leave a lasting impression.',
    ],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80',
    imageAlt: 'Three sisters founders',
  },
  pullQuote: {
    text: '"The spaces we inhabit have the power to quiet our minds and open our hearts."',
  },
  philosophy: {
    label: '(03) Philosophy',
    heading: 'Travel should feel personal, calm, and restorative—not transactional.',
    paragraphs: [
      'We believe that every interaction with our guests is an opportunity to show care. From the texture of the linens to the scent in the hallway, every detail is an intentional choice designed to elevate your stay.',
      "Hospitality, to us, is the art of anticipation. It's about creating an environment where you can drop your bags, exhale, and immediately feel at ease.",
    ],
  },
  closing: {
    body: 'We invite you to experience hospitality the way it was meant to be.',
    cta: {
      text: 'Discover Our Stays',
      href: '/properties',
    },
  },
};

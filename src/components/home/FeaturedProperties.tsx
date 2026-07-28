import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PropertyCard } from './PropertyCard';

// Realistic placeholder data
const PROPERTIES = [
  {
    id: '1',
    name: 'The Glasshouse',
    location: 'Upstate New York',
    description: 'A secluded architectural masterpiece surrounded by nature, featuring floor-to-ceiling windows and panoramic forest views.',
  },
  {
    id: '2',
    name: 'Villa Serena',
    location: 'Tuscany, Italy',
    description: 'An elegant restored 18th-century villa with private vineyards, an infinity pool, and authentic regional charm.',
  },
  {
    id: '3',
    name: 'Ocean Retreat',
    location: 'Malibu, California',
    description: 'A modern coastal sanctuary offering direct beach access, expansive decks, and unparalleled sunset vistas.',
  },
];

export function FeaturedProperties() {
  return (
    <Section className="bg-gray-50">
      <Container>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-gray-600 text-lg">
            Discover our curated collection of exceptional homes, designed to provide unforgettable stays in the world&apos;s most captivating locations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {PROPERTIES.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              name={property.name}
              location={property.location}
              description={property.description}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

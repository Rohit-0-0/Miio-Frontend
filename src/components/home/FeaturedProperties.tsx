import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PropertyCard } from './PropertyCard';
import { getPropertyListing } from '@/lib/server/property';
import { PropertyDocument } from '@/types/property';

export async function FeaturedProperties() {
  let properties: PropertyDocument[] = [];
  
  try {
    const response = await getPropertyListing({
      featured: 'true',
      status: 'PUBLISHED',
      visibleOnWebsite: 'true',
      sort: 'sortOrder',
      order: 'asc',
      limit: '3'
    });
    properties = response.data || [];
  } catch (error) {
    console.error('Failed to fetch featured properties:', error);
  }

  if (properties.length === 0) {
    return null; // Gracefully hide if no featured properties
  }

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
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              slug={property.slug}
              name={property.title}
              location={[property.city, property.country].filter(Boolean).join(', ') || 'Various Locations'}
              description={property.shortDescription || property.longDescription?.substring(0, 150) || ''}
              coverImage={property.coverImageId || property.gallery?.[0]?.assetId}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

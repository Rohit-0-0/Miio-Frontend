import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ExperiencesSection } from '@/types/homepage';
import { AppImage } from '@/components/media/AppImage';

export function Experiences({ experiences }: { experiences: ExperiencesSection }) {
  if (!experiences || !experiences.items || experiences.items.length === 0) return null;

  return (
    <Section className="bg-gray-50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            {experiences.title}
          </h2>
          {experiences.subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {experiences.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.items.map((item, index) => {

            return (
              <div key={item.id || index} className="flex flex-col group h-full bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-100">
                  {item.icon?.assetId ? (
                    <AppImage
                      image={item.icon}
                      alt={item.icon.alt || item.title}
                      fill
                      className="transition-transform duration-700 group-hover:scale-105 object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 w-full h-full flex items-center justify-center text-gray-400">
                      <span>Placeholder Image</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 flex-1 whitespace-pre-wrap">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

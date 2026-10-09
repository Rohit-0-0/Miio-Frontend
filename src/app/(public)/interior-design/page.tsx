import { Metadata } from 'next';
import { getInteriorDesignPage } from '@/lib/server/interiorDesign';
import { buildImageUrl } from '@/lib/media/buildImageUrl';
import Image from 'next/image';
import Link from 'next/link';
import { BeforeAfterSlider } from '@/components/interior-design/BeforeAfterSlider';
import { InteriorDesignForm } from '@/components/interior-design/InteriorDesignForm';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getInteriorDesignPage();
  return {
    title: data?.seo?.title || 'Interior Design & Property Styling | Miio',
    description: data?.seo?.description || 'Interior design and property styling for short-term rentals, serviced accommodation, investment properties and hospitality spaces across the UK and Australia.',
  };
}

export default async function InteriorDesignPage() {
  const data = await getInteriorDesignPage();

  // PDF Exact Copy Fallbacks
  const heroEyebrow = data?.hero?.eyebrow || 'INTERIOR DESIGN & PROPERTY STYLING';
  const heroHeadline = data?.hero?.headline || 'Beautifully designed. Made to perform.';
  const heroBody = data?.hero?.bodyCopy || 'Interior design and property styling for short-term stays, serviced accommodation, investment properties and hospitality spaces.\n\nWe create considered interiors that photograph beautifully, work effortlessly and are designed around the realities of commercial property — from guest experience and durability to turnover and long-term performance.';
  const heroCta = data?.hero?.ctaText || 'BOOK A DISCOVERY CALL';

  return (
    <main className="w-full bg-[#FEF6EE] text-[#241D19]">
      {/* HERO SECTION */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex flex-col justify-center items-center text-center px-5">
        {data?.hero?.backgroundImage ? (
          <Image
            src={buildImageUrl(data.hero.backgroundImage.asset?._ref || data.hero.backgroundImage) || ''}
            alt="Interior Design Hero"
            fill
            className="object-cover absolute inset-0 -z-10 brightness-75"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[#E8E1DA] -z-10" /> 
        )}
        
        <p className="text-sm tracking-widest uppercase mb-6">{heroEyebrow}</p>
        <h1 className="text-4xl md:text-6xl font-serif mb-8 max-w-3xl leading-tight">
          {heroHeadline}
        </h1>
        <div className="max-w-2xl text-lg opacity-80 whitespace-pre-line mb-10">
          {heroBody}
        </div>
        <Link href="#enquiry-form" className="bg-[#241D19] text-[#FEF6EE] px-8 py-4 uppercase text-sm tracking-widest hover:bg-black transition-colors">
          {heroCta}
        </Link>
      </section>

      {/* INTRO / OUR DIFFERENCE */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-[188px] py-24 md:py-32">
        <div className="max-w-3xl mb-20">
          <h2 className="text-3xl md:text-5xl font-serif mb-8">
            {data?.principles?.headline || 'Designed by people who operate property.'}
          </h2>
          <div className="text-lg opacity-80 whitespace-pre-line">
            {data?.principles?.bodyCopy || `We don't design spaces in isolation from the way they're used.\n\nAs owners and operators of short-term accommodation ourselves, we understand what happens after the photographs are taken — what guests notice, what gets touched, what wears quickly, what makes a property easier to maintain and what helps a stay stand apart online.\n\nThat experience shapes every decision we make, balancing considered design with the commercial realities of operating a property.`}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: 'Designed to be remembered', desc: 'Distinctive, considered spaces that create an experience guests remember — and want to return to.' },
            { title: 'Designed for real life', desc: 'Materials, furniture and layouts selected with durability, maintenance and turnover in mind.' },
            { title: 'Designed to perform', desc: 'Every decision considers how the property will photograph, present online and operate as a commercial space.' },
          ].map((principle, i) => (
            <div key={i} className="border-t border-[#241D19]/20 pt-6">
              <p className="text-sm font-semibold mb-2">PRINCIPLE 0{i + 1}</p>
              <h3 className="text-xl font-serif mb-4">{data?.principles?.items?.[i]?.title || principle.title}</h3>
              <p className="opacity-80">{data?.principles?.items?.[i]?.description || principle.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OUR WORK / CASE STUDIES */}
      <section className="w-full pb-24 md:pb-32 px-5 md:px-10 xl:px-[188px] max-w-[1440px] mx-auto">
        <div className="mb-16">
          <p className="text-sm font-semibold mb-4 uppercase tracking-widest">OUR WORK</p>
          <h2 className="text-3xl md:text-5xl font-serif mb-8 max-w-2xl">
            Spaces we&apos;ve transformed.
          </h2>
          <p className="text-lg opacity-80 max-w-3xl">
            From short-term stays to corporate and healthcare accommodation, our approach begins with the same question: how can this space look beautiful, work better and deliver more for the people using it?
          </p>
        </div>

        <div className="flex flex-col gap-24">
          {(data?.caseStudies && data.caseStudies.length > 0) ? (
            data.caseStudies.map((study: Record<string, any>, i: number) => (
              <div key={i}>
                <div className="flex flex-col md:flex-row gap-8 mb-8 items-start md:items-end justify-between">
                  <div className="max-w-2xl">
                    <p className="text-sm font-semibold mb-2">PROJECT {String(i + 1).padStart(2, '0')}</p>
                    <h3 className="text-2xl font-serif mb-4">{study.title}</h3>
                    <p className="opacity-80">{study.description}</p>
                  </div>
                  {(study.pdfUrl || study.linkUrl || study.linkText) && (
                    <Link 
                      href={study.pdfUrl || study.linkUrl || '#'} 
                      target={study.pdfUrl ? "_blank" : undefined}
                      className="uppercase tracking-widest text-sm border-b border-[#241D19] pb-1 hover:opacity-70 transition-opacity whitespace-nowrap"
                    >
                      {study.linkText || 'VIEW PROJECT →'}
                    </Link>
                  )}
                </div>
                <div className="w-full">
                  <BeforeAfterSlider 
                    beforeImage={study.beforeImage ? buildImageUrl(study.beforeImage.asset?._ref || study.beforeImage) || '' : "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop"} 
                    afterImage={study.afterImage ? buildImageUrl(study.afterImage.asset?._ref || study.afterImage) || '' : "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2070&auto=format&fit=crop"} 
                  />
                </div>
              </div>
            ))
          ) : (
            <div>
              <div className="flex flex-col md:flex-row gap-8 mb-8 items-start md:items-end justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold mb-2">PROJECT 01</p>
                  <h3 className="text-2xl font-serif mb-4">Sydney Short-Term Stay</h3>
                  <p className="opacity-80">A dated property reimagined as a considered, guest-ready stay, combining practical furnishing decisions with the warmth and character that defines Miio.</p>
                </div>
                <Link href="#" className="uppercase tracking-widest text-sm border-b border-[#241D19] pb-1 hover:opacity-70 transition-opacity whitespace-nowrap">
                  VIEW PROJECT →
                </Link>
              </div>
              <div className="w-full">
                <BeforeAfterSlider 
                  beforeImage="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop" 
                  afterImage="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2070&auto=format&fit=crop" 
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-16 flex justify-center">
          <Link href="#" className="uppercase tracking-widest text-sm border-b border-[#241D19] pb-1 hover:opacity-70 transition-opacity">
            VIEW ALL PROJECTS →
          </Link>
        </div>
      </section>

      {/* OUR WORK / CASE STUDIES */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-[188px] py-24 md:py-32">
        <p className="text-sm font-semibold mb-4 uppercase tracking-widest">OUR WORK</p>
        <h2 className="text-3xl md:text-5xl font-serif mb-16 max-w-2xl">Spaces we've transformed.</h2>
        <p className="text-lg opacity-80 whitespace-pre-line mb-16 max-w-3xl">
          From short-term stays to corporate and healthcare accommodation, our approach begins with the same question: how can this space look beautiful, work better and deliver more for the people using it?
        </p>
        
        {data?.caseStudies && data.caseStudies.length > 0 ? (
          <div className="flex flex-col gap-24">
            {data.caseStudies.map((study: any, i: number) => (
              <div key={i} className="flex flex-col gap-6">
                <BeforeAfterSlider 
                  beforeImage={buildImageUrl(study.beforeImage?.asset?._ref) || ''} 
                  afterImage={buildImageUrl(study.afterImage?.asset?._ref) || ''} 
                />
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mt-4">
                  <div className="max-w-2xl">
                    <p className="text-sm font-semibold mb-2 uppercase tracking-widest">PROJECT 0{i + 1}</p>
                    <h3 className="text-2xl font-serif mb-3">{study.title}</h3>
                    <p className="opacity-80 leading-relaxed">{study.description}</p>
                  </div>
                  {(study.linkUrl || study.pdfUrl) && (
                    <a 
                      href={study.pdfUrl ? study.pdfUrl : study.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block border-b border-[#241D19] pb-1 uppercase tracking-widest text-sm hover:opacity-70 transition-opacity"
                    >
                      {study.linkText || 'VIEW PROJECT →'}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-[#241D19]/10 text-center">
            <p className="opacity-60">Case studies will appear here once added in the CMS.</p>
          </div>
        )}
      </section>

      {/* SERVICES */}
      <section className="bg-[#241D19] text-[#FEF6EE] py-24 md:py-32 px-5 md:px-10 xl:px-[188px]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-sm font-semibold mb-4 uppercase tracking-widest">OUR SERVICES</p>
          <h2 className="text-3xl md:text-5xl font-serif mb-16 max-w-2xl">
            How we can help.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {[
              { title: 'Interior Design & Styling', desc: 'For properties that need a new direction or a considered refresh.\n\nCreative direction, spatial planning, colour and material selections, furniture specification and styling — shaped around your property, guest and commercial goals.' },
              { title: 'Furniture Sourcing & Procurement', desc: 'For owners who know what they want their property to become but don\'t have the time to source it.\n\nWe curate furniture, lighting, artwork and finishing pieces, then coordinate suppliers and purchasing on your behalf.' },
              { title: 'Turnkey Property Fit-Out', desc: 'From empty property to guest-ready.\n\nOur most complete service covers the entire process — concept development, sourcing, procurement, supplier coordination, installation, styling and final photography preparation.\n\nIdeal for investors and operators who want one team to take the property from blank canvas to finished space.' },
              { title: 'Hospitality & Commercial Styling', desc: 'Design and styling for serviced accommodation, corporate stays, healthcare accommodation and boutique hospitality spaces.\n\nWe balance warmth and visual impact with the practical demands of spaces designed for frequent use.' },
            ].map((service, i) => (
              <div key={i} className="border-t border-[#FEF6EE]/20 pt-8">
                <h3 className="text-2xl font-serif mb-6">{service.title}</h3>
                <p className="opacity-80 whitespace-pre-line leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-[#FEF6EE]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="font-semibold mb-2">Not sure what you need?</p>
              <p className="opacity-80">Book a Discovery Call and we&apos;ll recommend the right level of support.</p>
            </div>
            <Link href="#enquiry-form" className="bg-[#FEF6EE] text-[#241D19] px-8 py-4 uppercase text-sm tracking-widest hover:bg-white transition-colors whitespace-nowrap">
              BOOK A DISCOVERY CALL
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND MOMENT */}
      <section className="w-full h-[60vh] min-h-[400px] relative flex items-center justify-center text-center px-5">
        {data?.brandMoment?.image ? (
          <Image
            src={buildImageUrl(data.brandMoment.image.asset?._ref || data.brandMoment.image) || ''}
            alt="Interior Design Brand Moment"
            fill
            className="object-cover absolute inset-0 -z-10"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 bg-[#D3C7B6] -z-10" />
        )}
        <h2 className="text-3xl md:text-5xl font-serif max-w-3xl leading-tight">
          Spaces that perform as beautifully as they photograph.
        </h2>
      </section>

      {/* OUR PROCESS */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-[188px] py-24 md:py-32">
        <p className="text-sm font-semibold mb-4 uppercase tracking-widest">OUR PROCESS</p>
        <h2 className="text-3xl md:text-5xl font-serif mb-16">From first conversation to finished space.</h2>
        
        <div className="flex flex-col md:flex-row gap-8 overflow-x-auto pb-8 snap-x">
          {[
            { title: 'Discover', desc: 'We start with your property, audience, budget, timeline and what you want the space to achieve.' },
            { title: 'Design', desc: 'We develop the creative direction, layout, mood boards and furniture and material selections.' },
            { title: 'Source', desc: 'Depending on your service, we source and coordinate furniture, lighting, artwork and finishing pieces.' },
            { title: 'Install & Style', desc: 'We bring everything together on site, overseeing installation and styling the finished space.' },
            { title: 'Ready to perform', desc: 'Your property is handed over complete and ready for guests, photography or operation.' },
          ].map((step, i) => (
            <div key={i} className="min-w-[280px] flex-1 snap-start border-l border-[#241D19]/20 pl-6">
              <p className="text-xl font-serif mb-4"><span className="text-sm font-sans font-semibold mr-4 opacity-50">0{i+1}</span> {step.title}</p>
              <p className="opacity-80 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY MIIO */}
      <section className="bg-[#E8E1DA] py-24 md:py-32 px-5 md:px-10 xl:px-[188px]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-16 lg:gap-32">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-serif leading-tight sticky top-32">
              We design from the operator&apos;s side of the door.
            </h2>
          </div>
          <div className="flex-1 flex flex-col gap-12">
            {[
              { title: 'Hospitality experience', desc: 'We operate accommodation ourselves, so our design decisions are informed by real guest behaviour.' },
              { title: 'Commercial thinking', desc: 'Budget, durability, maintenance and operational efficiency are considered alongside aesthetics.' },
              { title: 'Design-led approach', desc: 'We believe commercial property doesn\'t need to feel commercial.' },
              { title: 'One considered process', desc: 'From concept and sourcing through to installation and styling, we can manage the project from beginning to end.' },
            ].map((point, i) => (
              <div key={i} className="border-t border-[#241D19]/20 pt-6">
                <h3 className="text-xl font-serif mb-3">{point.title}</h3>
                <p className="opacity-80">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="w-full bg-[#E8E1DA] py-24 md:py-32 px-5 md:px-10 xl:px-[188px]">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="text-sm font-semibold mb-12 uppercase tracking-widest">
            DESIGNED BY MIIO. PROVEN THROUGH MIIO.
          </p>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-4xl font-serif leading-snug mb-8">
              "{data?.testimonial?.quote || '[INSERT SELECTED GUEST REVIEW]'}"
            </h3>
            <p className="opacity-80">
              A Miio-operated stay, designed and styled by our team.
            </p>
          </div>
        </div>
      </section>

      {/* WHO WE WORK WITH */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-[188px] py-24 md:py-32">
        <p className="text-sm font-semibold mb-4 uppercase tracking-widest">{data?.clientGroups?.eyebrow || 'WHO WE WORK WITH'}</p>
        <h2 className="text-3xl md:text-5xl font-serif mb-16">{data?.clientGroups?.headline || 'Designed for property with a purpose.'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(data?.clientGroups?.groups || [
            { title: 'Short-Term Rental Owners', description: 'Creating distinctive stays designed around guest experience and repeatable operation.' },
            { title: 'Property Investors', description: 'Taking properties from acquisition or renovation through to fully furnished and guest-ready.' },
            { title: 'Serviced Accommodation Operators', description: 'Creating considered spaces that balance hospitality with operational efficiency.' },
            { title: 'Corporate & Healthcare Accommodation', description: 'Warm, durable interiors designed for longer stays and frequent use.' },
          ]).map((group: any, i: number) => (
            <div key={i} className="border-t border-[#241D19]/20 pt-6">
              <h3 className="text-xl font-serif mb-4">{group.title}</h3>
              <p className="opacity-80 text-sm leading-relaxed">{group.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-[800px] mx-auto px-5 md:px-10 py-24 md:py-32">
        <p className="text-sm font-semibold mb-4 uppercase tracking-widest text-center">FAQS</p>
        <h2 className="text-3xl md:text-5xl font-serif mb-16 text-center">Common questions.</h2>
        
        <div className="flex flex-col gap-6">
          {[
            { q: 'Do you only design for short-term stays?', a: 'While our roots are in short-term accommodation, we also design for corporate lets, healthcare accommodation, and boutique hospitality spaces.' },
            { q: 'How does the sourcing process work?', a: 'We leverage our trade accounts and supplier relationships to procure furniture and styling items on your behalf, managing the logistics, delivery and installation.' },
            { q: 'Can you work with my existing furniture?', a: 'Yes. If you have existing pieces you want to keep, we can build the creative direction and layout around them.' },
            { q: 'How long does a turnkey fit-out take?', a: 'Timelines vary based on the property size and scope, but a standard turnkey fit-out typically takes 4-8 weeks from concept approval to final installation.' },
          ].map((faq, i) => (
            <details key={i} className="group border-b border-[#241D19]/20 pb-6 cursor-pointer">
              <summary className="flex justify-between items-center font-serif text-xl md:text-2xl list-none">
                {faq.q}
                <span className="transform group-open:rotate-180 transition-transform duration-300">↓</span>
              </summary>
              <p className="mt-4 opacity-80 leading-relaxed pr-8">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA & ENQUIRY FORM */}
      <section className="bg-[#241D19] text-[#FEF6EE] text-center pt-32 pb-16 px-5 relative z-10">
        <p className="text-sm tracking-widest uppercase mb-6">INTERIOR DESIGN & PROPERTY STYLING</p>
        <h2 className="text-4xl md:text-5xl font-serif mb-8">Have a property in mind?</h2>
        <p className="text-lg opacity-80 mb-16 max-w-2xl mx-auto">
          Let&apos;s create a space that looks beautiful, works hard and stays with the people who experience it.
        </p>
        
        <div className="text-left max-w-4xl mx-auto mt-16">
          <InteriorDesignForm />
        </div>
      </section>
      {/* FINAL CTA SECTION */}
      <section className="w-full bg-[#E8E1DA] py-24 md:py-32 px-5 md:px-10 xl:px-[188px] text-center border-t border-[#241D19]/10">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <p className="text-sm font-semibold mb-6 uppercase tracking-widest">{data?.finalCta?.eyebrow || 'INTERIOR DESIGN & PROPERTY STYLING'}</p>
          <h2 className="text-3xl md:text-5xl font-serif mb-6">{data?.finalCta?.headline || 'Have a property in mind?'}</h2>
          <p className="opacity-80 mb-10 text-lg">
            {data?.finalCta?.bodyCopy || "Let's create a space that looks beautiful, works hard and stays with the people who experience it."}
          </p>
          <Link href={data?.finalCta?.ctaLink || '#enquiry-form'} className="bg-[#241D19] text-[#FEF6EE] px-8 py-4 uppercase text-sm tracking-widest hover:bg-[#241D19]/90 transition-colors inline-block">
            {data?.finalCta?.ctaText || 'BOOK A DISCOVERY CALL →'}
          </Link>
        </div>
      </section>
    </main>
  );
}

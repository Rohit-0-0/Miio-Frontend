import { sanityFetch } from './sanityFetch';

export async function getInteriorDesignPage() {
  const query = `
    *[_type == "interiorDesignPage"][0] {
      hero {
        backgroundImage,
        eyebrow,
        headline,
        bodyCopy,
        ctaText
      },
      principles {
        headline,
        bodyCopy,
        items
      },
      caseStudies[]->{
        title,
        description,
        linkUrl,
        "pdfUrl": pdfDownload.asset->url,
        linkText,
        beforeImage,
        afterImage
      },
      services {
        eyebrow,
        headline,
        items
      },
      brandMoment {
        image,
        headline
      },
      process {
        eyebrow,
        headline,
        steps
      },
      whyMiio {
        headline,
        points
      },
      testimonial->{
        quote,
        author,
        date,
        location,
        source
      },
      clientGroups {
        eyebrow,
        headline,
        groups
      },
      finalCta {
        eyebrow,
        headline,
        bodyCopy,
        ctaText,
        ctaLink
      },
      faqs[]->{
        question,
        answer
      },
      seo {
        title,
        description
      }
    }
  `;

  return await sanityFetch<any>({ 
    query,
    tags: ['interiorDesignPage', 'interiorCaseStudy', 'review', 'faq']
  });
}

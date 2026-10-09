import { sanityFetch } from './sanityFetch';

export async function getInteriorDesignPage() {
  const query = `
    *[_type == "interiorDesignPage"][0] {
      hero {
        "backgroundImage": backgroundImage.asset->url,
        "backgroundImageRef": backgroundImage.asset._ref,
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
      caseStudiesSection {
        eyebrow,
        headline,
        bodyCopy,
        caseStudies[]->{
          title,
          description,
          linkUrl,
          "pdfUrl": pdfDownload.asset->url,
          linkText,
          "beforeImage": beforeImage.asset->url,
          "afterImage": afterImage.asset->url
        }
      },
      services {
        eyebrow,
        headline,
        items,
        ctaHeadline,
        ctaBody,
        ctaButtonText
      },
      brandMoment {
        "image": image.asset->url,
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
      socialProofSection {
        eyebrow,
        supportingText,
        testimonials[]->{
          quote,
          author,
          date,
          location,
          source,
          "featuredImage": featuredImage.asset->url
        }
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
      "faqs": faqs[]->questions[] {
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

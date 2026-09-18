import { sanityFetch } from './sanityFetch';

export async function getSiteSettings() {
  const query = `*[_type == "siteSettings"][0]{
    brandName,
    logo,
    contact,
    socialLinks,
    analytics,
    defaultSeo,
    paymentTrustImages
  }`;
  
  return await sanityFetch<any>({ 
    query, 
    tags: ['siteSettings'] 
  });
}

export async function getNavigation() {
  const query = `*[_type == "navigation"][0]{
    headerNav[]{
      label,
      href,
      isExternal
    }
  }`;
  
  return await sanityFetch<any>({ 
    query, 
    tags: ['navigation'] 
  });
}

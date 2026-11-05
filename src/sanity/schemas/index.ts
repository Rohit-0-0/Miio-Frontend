import { seo } from './objects/seo'
import { cta } from './objects/cta'
import { hero } from './objects/hero'
import { button } from './objects/button'
import { customImage } from './objects/customImage'
import { navigationItem } from './objects/navigationItem'
import { footerColumn } from './objects/footerColumn'
import { socialLink } from './objects/socialLink'
import { legalRichText } from './objects/legalRichText'

import { siteSettings } from './singletons/siteSettings'
import { navigation } from './singletons/navigation'
import { footer } from './singletons/footer'
import { home } from './singletons/home'
import { about } from './singletons/about'

import { propertyEditorial } from './documents/propertyEditorial'
import { journal } from './documents/journal'
import { location } from './documents/location'
import { faq } from './documents/faq'
import { review } from './documents/review'
import { houseRules } from './documents/houseRules'
import { legalPage } from './documents/legalPage'
import { cancellationPolicy } from './documents/cancellationPolicy'

import { partnerWithUs } from './singletons/partnerWithUs'
import { journalPage } from './singletons/journalPage'
import { locationsPage } from './singletons/locationsPage'
import { staysPage } from './singletons/staysPage'
import { interiorDesignPage } from './singletons/interiorDesignPage'
import { reviewsPage } from './singletons/reviewsPage'

import { interiorCaseStudy } from './documents/interiorCaseStudy'

export const schemaTypes = [
  seo,
  cta,
  hero,
  button,
  customImage,
  navigationItem,
  footerColumn,
  socialLink,
  legalRichText,

  siteSettings,
  navigation,
  footer,
  home,
  about,
  partnerWithUs,
  journalPage,
  locationsPage,
  staysPage,

  propertyEditorial,
  journal,
  location,
  faq,
  review,
  houseRules,
  cancellationPolicy,
  legalPage,
  interiorDesignPage,
  reviewsPage,
  interiorCaseStudy,
]

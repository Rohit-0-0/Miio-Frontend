import { seo } from './objects/seo'
import { cta } from './objects/cta'
import { hero } from './objects/hero'
import { button } from './objects/button'
import { customImage } from './objects/customImage'
import { navigationItem } from './objects/navigationItem'
import { footerColumn } from './objects/footerColumn'
import { socialLink } from './objects/socialLink'

import { siteSettings } from './singletons/siteSettings'
import { navigation } from './singletons/navigation'
import { footer } from './singletons/footer'
import { home } from './singletons/home'
import { about } from './singletons/about'

import { propertyEditorial } from './documents/propertyEditorial'
import { journal } from './documents/journal'
import { location } from './documents/location'
import { faq } from './documents/faq'

import { partnerWithUs } from './singletons/partnerWithUs'
import { journalPage } from './singletons/journalPage'
import { locationsPage } from './singletons/locationsPage'
import { staysPage } from './singletons/staysPage'

export const schemaTypes = [
  seo,
  cta,
  hero,
  button,
  customImage,
  navigationItem,
  footerColumn,
  socialLink,

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
  faq
]

import type { StructureResolver } from 'sanity/structure'
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Miio Editorial Content')
    .items([
      // Pages Group
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Home Page')
                .child(
                  S.document()
                    .schemaType('home')
                    .documentId('home')
                ),
              S.listItem()
                .title('About Page')
                .child(
                  S.document()
                    .schemaType('about')
                    .documentId('about')
                ),
              S.listItem()
                .title('Partner With Us Page')
                .child(
                  S.document()
                    .schemaType('partnerWithUs')
                    .documentId('partnerWithUs')
                ),
              S.listItem()
                .title('Journal Page')
                .child(
                  S.document()
                    .schemaType('journalPage')
                    .documentId('journalPage')
                ),
              S.listItem()
                .title('Locations Page')
                .child(
                  S.document()
                    .schemaType('locationsPage')
                    .documentId('locationsPage')
                ),
              S.listItem()
                .title('Stays Page')
                .child(
                  S.document()
                    .schemaType('staysPage')
                    .documentId('staysPage')
                ),
            ])
        ),
      S.divider(),
      
      // Content Group
      S.listItem()
        .title('Content')
        .child(
          S.list()
            .title('Content')
            .items([
              S.documentTypeListItem('propertyEditorial').title('Property Editorials'),
              S.documentTypeListItem('journal').title('Journals'),
              S.documentTypeListItem('location').title('Locations'),
              S.documentTypeListItem('faq').title('FAQs'),
            ])
        ),

      // Hide all manually organized schemas from the main list
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['siteSettings', 'navigation', 'footer', 'home', 'about', 'partnerWithUs', 'journalPage', 'locationsPage', 'staysPage', 'propertyEditorial', 'journal', 'location', 'faq'].includes(
            listItem.getId() as string
          )
      )
    ])

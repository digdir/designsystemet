import {CogIcon} from '@sanity/icons'

export const structure = (S: any) =>
  S.list()
    .title('Innhold')
    .items([
      // Make a singleton of the document with ID “siteSettings”
      S.documentTypeListItem('page').title('Sider'),
      S.documentTypeListItem('blogPost').title('Blogginnlegg'),
      S.documentTypeListItem('person').title('Personer'),
      S.divider(),
      // S.documentTypeListItems().find((listItem: any) => listItem.getId() === 'footer'),
      // Add a visual divider

      S.documentTypeListItem('navigation').title('Hovednavigasjon').child(
        // Instead of rendering a list of documents, we render a single
        // document, specifying the `documentId` manually to ensure
        // that we're editing the single instance of the document
        S.document().schemaType('navigation').documentId('navigation')
      ),
      S.documentTypeListItem('footer').title('Footer').child(
        // Instead of rendering a list of documents, we render a single
        // document, specifying the `documentId` manually to ensure
        // that we're editing the single instance of the document
        S.document().schemaType('footer').documentId('footer')
      ),
      S.divider(),
      // Add the rest of the document types, but filter out the siteSettings type defined above
      S.documentTypeListItem('settings').title('Innstillinger').child(
        // Instead of rendering a list of documents, we render a single
        // document, specifying the `documentId` manually to ensure
        // that we're editing the single instance of the document
        S.document().schemaType('settings').documentId('settings')
      ),
    ])

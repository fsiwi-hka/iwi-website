import Document, { Html, Head, Main, NextScript } from 'next/document'

/* This document is needed because it's the simplest way to alter
 * surrounding HTML tags like <html> and <body>. See the documentation:
 * 
 * https://nextjs.org/docs/advanced-features/custom-document
 */

class MyDocument extends Document {
  render() {
    return (
      // we set the lang attribute here for accessibility
      <Html lang="de">
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Muli:wght@400;700&family=Roboto:wght@300;500&display=swap" rel="stylesheet"></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument

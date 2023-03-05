import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
          {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" /> */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap"
          />
        </Head>
        <body className="font-sans antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

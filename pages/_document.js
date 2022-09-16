import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html lang="pt-br">
                <Head>
                    <link rel="icon" href="/favicon.png"/>
                    <link rel="preload" href="/fonts/GTWalsheimPro-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                    <link rel="preload" href="/fonts/GTWalsheimPro-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                    <link rel="preload" href="/fonts/GTWalsheimPro-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

                    {/* Global Site Tag (gtag.js) - Google Analytics */}
                    <script async src={`https://www.googletagmanager.com/gtag/js?id=G-GGFDDDBMK7`} />
                    <script // eslint-disable-next-line
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', 'G-GGFDDDBMK7', {
                                  page_path: window.location.pathname,
                                });
                              `,
                        }}
                    />

                    <link rel="webmention" href="https://webmention.io/gabrielbarcelos.com.br/webmention" />
                    <link rel="pingback" href="https://webmention.io/gabrielbarcelos.com.br/xmlrpc" />
                    <link href="https://github.com/gabrielbarceloscn" rel="me" />
                    <link href="https://twitter.com/gabrielrb" rel="me" />
                    <link href="https://instagram.com/gabrielbarceloscn" rel="me" />
                </Head>
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
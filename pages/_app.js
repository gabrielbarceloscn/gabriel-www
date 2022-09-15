import {ChakraProvider} from "@chakra-ui/react";
import {register} from "timeago.js";
import {pt_BR} from "timeago.js/lib/lang";
import Head from 'next/head';
import customTheme from "../src/theme";
import "../styles/global.scss";
import SEO from "../components/seo";
import * as gtag from "../lib/gtag";
import {useEffect} from "react";
import {useRouter} from "next/router";

// registra locale PT-BR para o timeago.js
register("pt_BR", pt_BR);

function MyApp({Component, pageProps}) {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url) => {
            console.log(`handleRouteChange: ${url}`)
            gtag.pageview(url)
        }

        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router.events]);

    return <ChakraProvider theme={customTheme}>
        <SEO/>
        <Head>
            <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
        </Head>
        <Component {...pageProps} />

    </ChakraProvider>
}

export default MyApp

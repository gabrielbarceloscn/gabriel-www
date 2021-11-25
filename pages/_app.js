import {ChakraProvider} from "@chakra-ui/react";
import {format, render, cancel, register} from "timeago.js";
import {pt_BR} from "timeago.js/lib/lang";

import customTheme from "../src/theme";
import "../styles/global.scss";
import SEO from "../components/seo";

// registra locale PT-BR para o timeago.js
register("pt_BR", pt_BR);

function MyApp({Component, pageProps}) {
    return <ChakraProvider theme={customTheme}>
        <SEO/>
        <Component {...pageProps} />
    </ChakraProvider>
}

export default MyApp

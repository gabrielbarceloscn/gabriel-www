
import { ChakraProvider } from "@chakra-ui/react";

import customTheme from "../src/theme";
import "../styles/externalfonts.css";

function MyApp({ Component, pageProps }) {
  return <ChakraProvider theme={customTheme}>
    <Component {...pageProps} />
  </ChakraProvider>
}

export default MyApp

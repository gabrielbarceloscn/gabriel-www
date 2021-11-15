import {extendTheme, theme as base} from "@chakra-ui/react";

/*
Brand colors created with help from:
https://www.hyperthe.me/
Used an image color picker, to pick the yellow-like collor from my avatar,
and used hypertheme to create color variations.
 */
const customTheme = extendTheme(
    {
        colors: {
            brand: {
                "50": "#fbfaf1",
                "100": "#f1edc8",
                "200": "#ece7b4",
                "300": "#e7e0a0",
                "400": "#e1d98c",
                "500": "rgba(215,204,99,255)",
                "600": "#cdbf3a",
                "700": "#bdb030",
                "800": "#a99d2b",
                "900": "#807721"
            }
        },
        fonts: {
            heading: `Montserrat, ${base.fonts?.heading}`,
            body: `Inter, ${base.fonts?.body}`,
        },
    }
)

export default customTheme;
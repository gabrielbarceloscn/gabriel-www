import {Box, chakra, Heading, Text, useBreakpointValue} from "@chakra-ui/react";

const PageHeader = ({title, description, children, compact}) => {

    const wrapperMarginBottom = compact ? {base: '0', sm: '40px'} : {base: '50px', sm: '90px'};
    const responsiveHeadingFontSize = useBreakpointValue({ base: "lg", md: "xl" });

    return (
        <Box mb={{...wrapperMarginBottom}}>
            <Heading as={"h1"} size={responsiveHeadingFontSize} mb={["12px", "15px"]} fontWeight={"800"} letterSpacing={"-0.3px"}>{title}</Heading>
            {description && <Text fontSize={["17px", "19px"]} opacity={"0.8"} fontWeight={"500"} lineHeight={"1.5"}>{description}</Text>}
            {children}
        </Box>
    )
}

export default PageHeader;
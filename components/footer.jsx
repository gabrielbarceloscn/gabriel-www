import {Box, Container, Divider, Flex, HStack, Stack, Text, VStack} from "@chakra-ui/react";

const Footer = (props) => {

    return (
        <Box bg={"gray"} mt={5}>
            <Container maxW={"container.lg"}>
                <footer>
                    <Divider/>
                    <Flex w={"100%"} mt={3} direction={{base: "column", md: "row"}} justify={"space-around"}>
                        <VStack>
                            <Text>Home</Text>
                        </VStack>
                        <VStack>
                            <Text>Twitter</Text>
                            <Text>Github</Text>
                        </VStack>
                        <VStack>
                            <Text>Changelog</Text>
                        </VStack>
                    </Flex>
                </footer>
            </Container>
        </Box>
    )
}

export default Footer;
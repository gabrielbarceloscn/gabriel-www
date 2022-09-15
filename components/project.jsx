import {Box, Flex, Heading, Link, Text, useBreakpointValue} from "@chakra-ui/react";
import Image from "next/image";
import styles from "./project.module.scss";
import {HiLink} from "react-icons/hi";

const Project = ({title, description, link, image, linkText, priority}) => {

    const responsiveHeadingFontSize = useBreakpointValue({ base: "26px", sm: "30px" });

    return (
        <Box w="100%" mb={["40px", "75px"]} mt={"10px"}>
            <Link href={link} isExternal={true}>
                <Box position={"relative"} mb={"20px"} pb={"50%"} overflow={"hidden"}
                     backgroundColor={"var(--chakra-colors-brand-100)"}
                     borderRadius={"15px"}
                     h={460}
                     mr={{lg: "-25px"}} ml={{lg: "-25px"}}
                >
                    {image && (
                        <Flex
                            position={"absolute"}
                        right={"0"}
                            bottom={"0"}
                            left={"0"}
                            direction={"column"}
                            justifyContent={"flex-end"}
                            w={"100%"}
                            h={"100%"}
                            padding={"25px"}
                            pb={0}
                        >
                            <Image className={styles.image} src={image} alt={`${description}`} layout="responsive"
                            priority={true}/>
                        </Flex>
                    )}
                </Box>
            </Link>
            <Heading as="h3" size="md" mb={"5px"} fontSize={responsiveHeadingFontSize}>{title}</Heading>
            <Text mb={["8px", "12px"]}>{description}</Text>
            <Link href={link} display={"inline-flex"} alignItems={"center"}
                  fontWeight={"400"} isExternal={true} color={"brand.800"}
                  fontSize={"18px"}
                  transition={"color 200ms ease-out"}
            >
                Visitar caldasnovas.app
                <Box ml={"10px"}>
                    <HiLink/>
                </Box>
            </Link>
        </Box>
    )
}

export default Project;
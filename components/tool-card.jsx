import React from "react";
import {
    HStack,
    VStack,
    Text,
    useColorModeValue as mode,
    Tag,
    TagLabel,
    TagRightIcon,
    Box,
    AspectRatio, Link,
} from "@chakra-ui/react";
import Image from "next/image";

const ToolCard = ({
                      name,
                      platform,
                      image,
                      link,
                      description,
                  }) => {

    return (

        <VStack
            align="start"
            justify="flex-start"
            spacing={1}
            maxW="lg"
            h="100%"
        >
            <HStack
                p={4}
                bg={"brand.100"}
                rounded="lg"
                borderWidth="1px"
                borderColor={"brand.800"}
                w="100%"
                textAlign="left"
                align="start"
                spacing={4}
                transition="all 0.25s"
                transition-timing-function="spring(1 100 10 10)"
                _hover={{transform: "translateY(-4px)", shadow: "lg"}}
            >
                <Box
                    rounded="lg"
                    p={2}
                    position="relative"
                    overflow="hidden"
                    lineHeight={0}
                    boxShadow="inset 0 0 1px 1px rgba(0, 0, 0, 0.015)"
                >
                    <Box
                        position="absolute"
                        top={0}
                        bottom={0}
                        left={0}
                        right={0}
                        opacity={0.25}
                    />
                    <Image
                        src={image ? image[0].url : "/"}
                        height={36}
                        width={36}
                        layout="fixed"
                        rounded="md"
                    />
                </Box>
                <Link href={link} color={["brand", "brand.900"]} fontWeight="bold" fontSize="md" noOfLines={2}>
                    {name}
                </Link>

            </HStack>
            <Tag>{platform}</Tag>
            <VStack spacing={0} align="start" flexGrow="1">

                <Text fontSize="sm">
                    {description}
                </Text>
            </VStack>
        </VStack>
    );
};

export default ToolCard;

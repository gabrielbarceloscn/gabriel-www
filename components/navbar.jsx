import {Avatar, HStack, Text} from "@chakra-ui/react";

const Navbar = (props) => {

    return (
        <HStack as={"header"} bg={"whitesmoke"} justifyContent={"space-between"} alignItems={"center"}>
            <Avatar src={"/avatar-small.jpg"}/>
            <Text color={"brand.900"} textDecoration={"underline"}>Blog</Text>
            <Text>Leitura</Text>
            <Text>Links</Text>
            <Text>Favoritos</Text>
        </HStack>
    )
}

export default Navbar;
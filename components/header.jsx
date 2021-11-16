import {Avatar, Box, Container, Flex, HStack, Link, LinkOverlay, Text} from "@chakra-ui/react";
import styles from './header.module.scss';
import Spacer from "./spacer";
import {useRouter} from "next/router";

const links = [
    {name: 'Posts', path: '/'},
    {name: 'Leitura', path: '/books'},
    {name: 'Stack', path: '/stack'},
    {name: 'Favoritos', path: '/bookmarks'}
]

const Header = (props) => {
    const router = useRouter();
    const pathname = router.pathname.split('/[')[0] // active paths on dynamic subpages

    return (
        <>
            <Box as={"header"} className={styles.header}>
                <Flex as={Container} justifyContent={"space-between"}
                      alignItems={"center"} m={"0 auto"}
                      p={{base: "10px 15px", md: "20px 30px"}}
                >
                    <Link href={'/'}>
                        <Avatar src={"/avatar-small.jpg"}
                                h={{base: '36px', sm: '54px'}}
                                w={{base: '36px', sm: '54px'}}
                                name={"Gabriel Barcelos"}/>
                    </Link>
                    <Box as={"nav"} alignItems={"center"} top={{base: '-2px', md: '0px'}} position={"relative"}>
                        <ul className={styles.links}>
                            {links.map((obj, idx) =>
                                (
                                    <li key={idx} className={pathname === obj.path ? styles.linkActive : styles.link}>
                                        <Link href={obj.path}>{obj.name}</Link>
                                    </li>
                                ))}
                        </ul>
                    </Box>
                </Flex>
            </Box>
            <Spacer/>
        </>
    )
}

export default Header;
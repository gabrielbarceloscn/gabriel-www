import {Container, Heading, Link, chakra} from "@chakra-ui/react";
import Header from "./header";
import PageTransition from "./page-transition";
import styles from "./page.module.scss";

const footerLinks = [
    {name: 'Início', url: '/', isExternal: false}
]

const Page = ({children}) => {

    return (
        <Container>
            <Header/>

            <chakra.main mb={{base: '50px', sm: '80px'}}>
                <PageTransition>{children}</PageTransition>
            </chakra.main>
            <footer className={styles.footer}>
                <ul className={styles.links}>
                    {footerLinks.map(link => (
                        <li key={link.name}>
                            <Link href={link.url} isExternal={link.isExternal}>
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </footer>
        </Container>
    )
}

export default Page;
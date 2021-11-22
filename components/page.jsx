import {Container, Heading, Link, chakra} from "@chakra-ui/react";
import Header from "./header";
import PageTransition from "./page-transition";
import styles from "./page.module.scss";

const footerLinks = [
    {name: 'Início', url: '/', isExternal: false},
    {name: 'Instagram', url: 'https://instagram.com/gabrielbarceloscn', isExternal: true},
]

const Page = ({children}) => {

    return (
        <Container maxW={"container.md"}>
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
                {/*<NowPlaying />*/}
                <p className={styles.copyright}>&copy; Gabriel Barcelos {new Date().getFullYear()}</p>
            </footer>
        </Container>
    )
}

export default Page;
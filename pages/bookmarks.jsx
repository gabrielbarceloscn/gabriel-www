import Page from "../components/page";
import PageHeader from "../components/page-header";
import {Box, Divider, Heading, Image, Link, SimpleGrid, Skeleton, Tag, Text, useColorModeValue as mode} from "@chakra-ui/react";
import {formatDate} from "../lib/formatDate";

const BookmarkItem = ({title, excerpt, cover, type, link, created, tags}) => {

    return (
        <Box>
            <Link href={link} isExternal={true}>
                <Image _hover={{
                    transform: "translateY(-4px)",
                    shadow: "sm",
                    textDecoration: "none",
                }} src={cover} fallback={<Skeleton/>} objectFit="cover"/>
            </Link>
            {tags && <Box my={2}> {tags.map((tag) => (<Tag key={tag}>{tag}</Tag>))}</Box>}
            <Link href={link} isExternal={true}>
                <Heading size={"sm"} mt={2}>{title}</Heading>
            </Link>
            <Text mt={2} fontSize={"12px"} opacity={0.6}>{excerpt}</Text>

            <Text mt={5} fontSize={"12px"} opacity={0.6}>Incluído: {formatDate(created)}</Text>

        </Box>
    )
}

const Bookmarks = ({bookmarks}) => {

    return (
        <Page>
            <PageHeader
                title={"Favoritos"}
                description={"Artigos, ferramentas, curiosidades, etc. Links podem vir a ser úteis em algum momento."}
            />

            {bookmarks !== null && bookmarks.length > 0
                ?
                <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                    {bookmarks.map((b) => (
                        <BookmarkItem key={b.link} {...b}/>
                    ))}
                </SimpleGrid>
                : <Text>Favoritos não encontrados.</Text>}

        </Page>
    )
}


export const getStaticProps = async context => {
    const url = `https://api.raindrop.io/rest/v1/raindrops/0`;

    const res = await fetch(url, {
        method: "get",
        headers: new Headers({
            Authorization: `Bearer ${process.env.RAINDROP_ACCESS_TOKEN}`,
            "Content-Type": "application/x-www-form-urlencoded",
        }),
    });

    const bookmarks = await res.json();

    if (!bookmarks) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            bookmarks: bookmarks.items,
        },
        revalidate: 1,
    }
}

export default Bookmarks;
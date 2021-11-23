import {Fragment} from "react";
import PageHeader from "../../components/page-header";
import Page from "../../components/page";
import {getBlocks, getDatabase, getPage} from "../../lib/notionApi";
import slugify from "slugify";
import {useRouter} from "next/router";
import {Box, Button, Flex, Heading, Link, Tag, Text, useColorMode} from "@chakra-ui/react";
import Image from "next/image";
import styles from "./book.module.scss";
import {Link2} from "react-feather";
import {NotionBlockRender} from "../../components/notion-block-render";

const Book = ({meta, blocks}) => {
    const router = useRouter();
    const {slug} = router.query;
    const { colorMode } = useColorMode();

    if (router.isFallback) {
        return (
            <Page>
                <>Carregando… Aguarde alguns instantes e atualize a página.</>
            </Page>
        )
    }

    if (!meta) {
        return (
            <Page>
                <>Livro não encontrado.</>
            </Page>
        )
    }

    const title = meta.properties.Title.title[0]?.plain_text;
    const author = meta.properties.Author.rich_text[0]?.plain_text;
    const link = meta.properties.Link?.url;
    const cover = meta.properties.Image.files[0]?.file.url;
    const status = meta.properties.Status.select.name;
    const categoriesNames = meta.properties.Category.multi_select?.map(c => c.name);


    const tagTextColor = colorMode === "light" ? "gray.800" : "white";


    return (
        <Page>
            <Flex direction={["column", "row"]} as={"header"}
                  mb={"40px"} p={"30px"}
                  backgroundColor={"var(--boxBg)"}
                  borderRadius={"8px"}>
                <Image
                    className={styles.cover}
                    layout={"fixed"}
                    src={cover || "https://via.placeholder.com/160x240?text=Capa+indisponivel"}
                    alt={title}
                    width={218}
                    height={328}/>
                <Box marginLeft={{sm: "43px"}}>
                    <Heading fontWeight={"800"} fontSize={"32px"}>{title}</Heading>
                    <Text opacity={0.6} fontSize={"17px"} fontWeight={"500"} mb={"20px"}>{author}</Text>
                    <dl className={styles.metaList}>
                        <dt>Categoria</dt>
                        <dd>{categoriesNames.map((c) => (<Tag key={c} size={"md"} colorScheme={"brand"} color={tagTextColor}>{c}</Tag>))}</dd>
                    </dl>
                    {link && (
                        <Link href={link} fontSize={"14px"} isExternal={true} display={"inline-flex"}>
                            Comprar o Livro
                            <Box ml={2}>
                                <Link2/>
                            </Box>
                        </Link>
                    )}
                </Box>
            </Flex>
            <Box>
                {blocks.map((block) => (
                    <Fragment key={block.id}>{NotionBlockRender(block)}</Fragment>
                ))}
            </Box>
        </Page>
    )
}

export const getStaticPaths = async () => {

    const data = await getDatabase(process.env.NOTION_BOOK_DATABASE_ID);
    const paths =
        data.map(b => `/books/${slugify(b.properties.Title.title[0].plain_text, {lower: true})}`);

    return {
        paths,
        fallback: true,
    }
}

export const getStaticProps = async context => {

    const data = await getDatabase(process.env.NOTION_BOOK_DATABASE_ID);

    const {slug} = context.params;
    const currentBookMeta =
        data.find(b => slugify(b.properties.Title.title[0].plain_text, {lower: true}) === slug);

    if (!currentBookMeta) {
        return {
            notFound: true,
        }
    }

    // const currentBookPage = await getPage(currentBookMeta.id);
    const notionBlocks = await getBlocks(currentBookMeta.id);

    return {
        props: {
            meta: currentBookMeta,
            blocks: notionBlocks,
        },
        revalidate: 1,
    }
}

export default Book;
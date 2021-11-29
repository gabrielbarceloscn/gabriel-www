import {Fragment} from "react";
import Page from "../../components/page";
import {getBlocks, getDatabase} from "../../lib/notionApi";
import slugify from "slugify";
import {useRouter} from "next/router";
import {Box, Flex, Heading, Link, Tag, Text, useColorMode} from "@chakra-ui/react";
import Image from "next/image";
import styles from "./book.module.scss";
import {HiLink} from "react-icons/hi";
import {NotionBlockRender} from "../../components/notion-block-render";
import {NextSeo} from "next-seo";

const Book = ({meta, blocks}) => {
    const router = useRouter();
    const {slug} = router.query;
    const {colorMode} = useColorMode();

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

    const seoTitle = `${title} - Resenha por Gabriel Barcelos`
    const seoDesc = `Resenha, anotações e insights do livro ${title} de ${author}`

    return (
        <Page>
            <NextSeo
                title={seoTitle}
                description={seoDesc}
                openGraph={{
                    title: seoTitle,
                    url: `https://gabrielbarcelos.com.br/books/${slug}`,
                    description: seoDesc,
                    images: [
                        {
                            url: cover
                                ? `${cover}`
                                : `https://og-image.vercel.app/Resenha%20de%20Livro%20%7C%20Gabriel%20Barcelos.jpeg?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-black.svg&images=https%3A%2F%2Fgabrielbarcelos.com.br%2Favatar-small.jpg`,
                            alt: `capa do livro ${title}`,
                        },
                    ],
                    site_name: 'Gabriel Barcelos',
                }}
                twitter={{
                    cardType: 'summary_large_image',
                }}
            />
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
                        <dd>{categoriesNames.map((c) => (
                            <Tag key={c} size={"md"} colorScheme={"brand"} color={tagTextColor}>{c}</Tag>))}</dd>
                    </dl>
                    {link && (
                        <Link href={link} fontSize={"14px"} isExternal={true} display={"inline-flex"}>
                            Comprar o Livro
                            <Box ml={2}>
                                <HiLink/>
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
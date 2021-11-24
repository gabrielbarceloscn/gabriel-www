import styles from "./post.module.scss";
import {getBlocks, getDatabase} from "../../lib/notionApi";
import slugify from "slugify";
import Page from "../../components/page";
import {Box, Text} from "@chakra-ui/react";
import Image from "next/image";
import {useRouter} from "next/router";
import PageHeader from "../../components/page-header";
import {formatDate} from "../../lib/formatDate";
import {NotionBlockRender} from "../../components/notion-block-render";
import {Fragment} from "react";

const Post = ({meta, blocks}) => {
    const router = useRouter();

    if (router.isFallback) {
        return (
            <Page>
                <Text>Carregando… Aguarde alguns instantes e atualize a página.</Text>
            </Page>
        )
    }

    if (!meta) {
        return (
            <Page>
                <Text>Post não encontrado.</Text>
            </Page>
        )
    }


    const title = meta.properties.Title.title[0]?.plain_text;
    // const slug = slugify(title, {lower: true});

    const description = meta.properties.Description.rich_text[0]?.plain_text;

    const publishedAt = meta.properties.PublishDate?.date.start;
    const updatedAt = meta.last_edited_time;

    const link = meta.properties.Link?.url;
    const cover = meta?.cover?.file?.url;
    const status = meta.properties.Status.select.name;
    const tags = meta.properties.Tags.multi_select?.map(c => c.name);

    return (
        <Page>
            {/*Post image cover wrapper*/}
            {cover && <Box
                    marginLeft={{base: "-15px", sm: "-20px"}}
                    marginRight={{base: "-15px", sm: "-20px"}}
                    marginBottom={["15px", "30px"]}
                    marginTop={{base: "-30px"}}
                    overflow={"hidden"}
                    border={"1px solid var(--border)"}
                    borderRadius={{sm: "12px"}}
                    borderWidth={{sm: "1px"}}
                    borderRightWidth={0}
                    borderLeftWidth={0}
                >
                    <Image src={cover} alt={"alt"} width={2024} height={1012} layout={"responsive"}/>
                </Box>}
            <PageHeader title={title}>
                <Text fontSize={"0.95em"} opacity={"0.7"}>
                    Publicado em <time dateTime={publishedAt}>{formatDate(publishedAt)}</time> &middot;
                    {updatedAt && ` Atualizado em ${formatDate(updatedAt)}`}
                </Text>
            </PageHeader>
            <Box as={"article"}>
                {blocks.map((block) => (
                    <Fragment key={block.id}>{NotionBlockRender(block)}</Fragment>
                ))}
            </Box>
        </Page>
    )
}

export const getStaticPaths = async () => {

    const data = await getDatabase(process.env.NOTION_BLOG_DATABASE_ID);
    const paths =
        data
            .map(b => `/books/${slugify(b.properties.Title.title[0].plain_text, {lower: true})}`)
            // Map the path into the static paths object required by Next.js
            .map(s => ({params: {slug: s}}));

    return {
        paths,
        fallback: true,
    }
}

export const getStaticProps = async context => {

    const data = await getDatabase(process.env.NOTION_BLOG_DATABASE_ID);

    const {slug} = context.params;
    const currentBookMeta =
        data.find(b => slugify(b.properties.Title.title[0].plain_text, {lower: true}) === slug);

    if (!currentBookMeta) {
        return {
            notFound: true,
        }
    }

    const notionBlocks = await getBlocks(currentBookMeta.id);

    // Retrieve block children for nested blocks (one level deep), for example toggle blocks
    // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
    const childBlocks = await Promise.all(
        notionBlocks
            .filter((block) => block.has_children)
            .map(async (block) => {
                return {
                    id: block.id,
                    children: await getBlocks(block.id),
                };
            })
    );
    const blocksWithChildren = notionBlocks.map((block) => {
        // Add child blocks if the block should contain children but none exists
        if (block.has_children && !block[block.type].children) {
            block[block.type]["children"] = childBlocks.find(
                (x) => x.id === block.id
            )?.children;
        }
        return block;
    });

    return {
        props: {
            meta: currentBookMeta,
            blocks: blocksWithChildren,
        },
        revalidate: 1,
    }
}

export default Post;
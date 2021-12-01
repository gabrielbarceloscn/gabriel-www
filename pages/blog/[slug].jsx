import styles from "./post.module.scss";
import {getBlocks, getDatabase} from "../../lib/notionApi";
import slugify from "slugify";
import Page from "../../components/page";
import {Box, Skeleton, Spinner, Stack, Text} from "@chakra-ui/react";
import Image from "next/image";
import {useRouter} from "next/router";
import PageHeader from "../../components/page-header";
import {formatDate} from "../../lib/formatDate";
import {NotionBlockRender} from "../../components/notion-block-render";
import {Fragment} from "react";
import {NextSeo} from "next-seo";
import cloudinaryCustomLoader from "../../lib/imgCustomLoader";

const Post = ({meta, blocks, slug}) => {
    const router = useRouter();

    if (router.isFallback) {
        return (
            <Page>
                <Stack>
                    <Skeleton height='20px' />
                    <Text>Carregando...</Text>
                </Stack>
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

    const seoTitle = `${title} | Gabriel Barcelos`;
    const seoDesc = `${description}`
    const url = `https://gabrielbarcelos.com.br/blog/${slug}`

    return (
        <Page>
            <NextSeo
                title={seoTitle}
                description={seoDesc}
                canonical={url}
                openGraph={{
                    title: seoTitle,
                    url,
                    description: seoDesc,
                    images: [
                        {
                            url: cover
                                ? `${cover}`
                                : `https://og-image.vercel.app/Post%20%7C%20Gabriel%20Barcelos.jpeg?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-black.svg&images=https%3A%2F%2Fgabrielbarcelos.com.br%2Favatar-small.jpg`,
                            alt: meta.title,
                        },
                    ],
                    site_name: 'Gabriel Barcelos',
                    type: 'article',
                    article: {
                        publishedTime: publishedAt,
                        modifiedTime: updatedAt,
                        authors: ['https://gabrielbarcelos.com.br'],
                    },
                }}
                twitter={{
                    cardType: 'summary_large_image',
                }}
            />
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
                <Image src={cover} loader={cloudinaryCustomLoader} alt={"alt"} width={2024} height={1012}
                       layout={"responsive"}/>
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

const uploadImageToCloudAndGetNewPublicUrl = async (cloudinaryClient, originUrl) => {
    let cleanUrl = originUrl.split('?')[0];
    let cleanUrlEncoded = new Buffer(cleanUrl).toString('base64');
    let cdnUploadResponse = await cloudinaryClient.uploader.upload(originUrl, {
        "public_id": cleanUrlEncoded,
        folder: "from-notion",
        unique_filename: false,
        ovewrite: false,
        resource_type: 'image',
    });
    return cdnUploadResponse.secure_url;
}

const handleImageBlock = async (cloudinaryClient, block) => {
    if (!block)
        return;

    if (block.type !== "image")
        return;

    if (block.image.type !== "file")
        return;

    const originalUrl =
        block.image.file.url;

    await uploadImageToCloudAndGetNewPublicUrl(cloudinaryClient, originalUrl);

    return;
}

export const getStaticProps = async context => {

    // Inicializa e configura client do Cloudinary
    let cloudinary = require("cloudinary").v2;
    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
        api_key: process.env.CLOUDINARY_APIKEY,
        api_secret: process.env.CLOUDINARY_APISECRET
    });

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

        // se for bloco do tipo imagem, faz upload para o Cloudinary
        // handleImageBlock(cloudinary, block);

        return block;
    });

    let coverUrl = currentBookMeta?.cover?.file?.url;
    if (coverUrl) {

        currentBookMeta.cover.file.url = await uploadImageToCloudAndGetNewPublicUrl(cloudinary, coverUrl);
    }

    return {
        props: {
            meta: currentBookMeta,
            blocks: blocksWithChildren,
            slug
        },
        revalidate: 1,
    }
}

export default Post;
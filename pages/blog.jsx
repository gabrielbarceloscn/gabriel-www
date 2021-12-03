import Page from "../components/page";
import PageHeader from "../components/page-header";
import {Box, Link, Text} from "@chakra-ui/react";
import Image from "next/image";
import {Image as CImage} from "@chakra-ui/react";
import {formatDate} from "../lib/formatDate";
import {getDatabase} from "../lib/notionApi";
import slugify from "slugify";
import {NextSeo} from "next-seo";
import cloudinaryCustomLoader from "../lib/imgCustomLoader";
import {uploadImageToCloudAndGetNewPublicUrl} from "../lib/cloudinary";

const BlogListItem = (props) => {
    const title = props.properties.Title.title[0]?.plain_text;
    const slug = slugify(title, {lower: true});

    const description = props.properties.Description.rich_text[0]?.plain_text;

    const publishedAt = props.properties.PublishDate?.date.start;
    const updatedAt = props.last_edited_time;

    const pinned = props.pinned;
    const link = props.properties.Link?.url;
    const cover = props?.cover?.file?.url || props?.cover?.external?.url;
    const status = props.properties.Status.select.name;
    const tags = props.properties.Tags.multi_select?.map(c => c.name);

    return (
        <Box mb={"4rem"}>
            {/*Post image cover wrapper*/}
            {cover && <a href={`/blog/${slug}/`}>
                <Box
                    marginLeft={{base: "-15px", sm: "-20px"}}
                    marginRight={{base: "-15px", sm: "-20px"}}
                    marginBottom={["15px", "30px"]}
                    overflow={"hidden"}
                    border={"1px solid var(--border)"}
                    borderRadius={{sm: "12px"}}
                    borderWidth={{sm: "1px"}}
                    borderRightWidth={0}
                    borderLeftWidth={0}
                >
                    <Image src={cover} loader={cloudinaryCustomLoader} alt={"alt"} width={2024} height={1012}
                           layout={"responsive"}/>
                    {/*<CImage src={cover} />*/}
                </Box>
            </a>}
            <Link href={`/blog/${slug}/`}
                  display={"block"}
                  marginBottom={"10px"}
                  colorScheme={"brand"}
                  fontWeight={"700"}
                  fontSize={["20px", "22px"]}
            >
                {pinned ? "📍 " : ""} {title}
            </Link>
            <Text mb={"10px"} fontSize={["16px", "18px"]} opacity={"0.7"}>{description}</Text>
            <Text fontSize={"0.95em"} opacity={"0.5"}>
                Publicado em <time dateTime={publishedAt}>{formatDate(publishedAt)}</time> &middot;
                {updatedAt && ` Atualizado em ${formatDate(updatedAt)}`}
            </Text>
        </Box>
    )
}

const Blog = ({posts, pinned}) => {
    const seoTitle = 'Blog | Gabriel Barcelos';
    const seoDesc = 'Eu escrevo sobre negócios, marketing, finanças pessoais e compartilho insights sobre temas diversos.';

    return (
        <Page>
            <NextSeo
                title={seoTitle}
                description={seoDesc}
                openGraph={{
                    title: seoTitle,
                    url: `https://gabrielbarcelos.com.br/blog/`,
                    description: seoDesc,
                    site_name: 'Gabriel Barcelos',
                }}
                twitter={{
                    cardType: 'summary_large_image',
                }}
            />
            <PageHeader
                title={"Blog"}
                description={"Eu escrevo sobre negócios, marketing, finanças pessoais e compartilho insights sobre temas diversos."}
            />

            {
                pinned
                    ? pinned.map((p) => (<BlogListItem key={p.id} {...p} pinned={true}/>))
                    : null
            }
            {
                posts
                    ? posts.map((p) => (<BlogListItem key={p.id} {...p}/>))
                    : <Text>Nenhum post encontrado.</Text>
            }
        </Page>
    )
}

export async function getStaticProps() {
    // Inicializa e configura client do Cloudinary
    let cloudinary = require("cloudinary").v2;
    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
        api_key: process.env.CLOUDINARY_APIKEY,
        api_secret: process.env.CLOUDINARY_APISECRET
    });

    let data = await getDatabase(process.env.NOTION_BLOG_DATABASE_ID);

    // faz upload das capas de posts pro cloudinary
    data.map((postMeta) => {
        // fazer upload da cover pro cloudinary
        const coverUrl = postMeta?.cover?.file?.url;
        if (coverUrl)
            uploadImageToCloudAndGetNewPublicUrl(cloudinary, coverUrl);

        // retornar mesmo objeto
        return postMeta;
    });

    const currentDateTime = Date.now();
    const published = data.filter(b =>
        b.properties.Status?.select?.name === "Published"
        && new Date(b.properties.PublishDate?.date.start) <= currentDateTime
        && b.properties.Pinned.checkbox !== true
    );
    const pinned = data.filter(b =>
        b.properties.Pinned.checkbox === true
        && new Date(b.properties.PublishDate?.date.start) <= currentDateTime
    );


    return {
        props: {
            posts: published,
            pinned,
        },
        revalidate: 1,
    }
}

export default Blog;
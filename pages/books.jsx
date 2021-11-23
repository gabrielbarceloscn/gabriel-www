import Header from "../components/header";
import Page from "../components/page";
import PageHeader from "../components/page-header";
import {getDatabase} from "../lib/notionApi";
import Image from "next/image";
import slugify from "slugify";
import {motion} from "framer-motion";
import {Box, Grid, Heading, Link, LinkOverlay, Text} from "@chakra-ui/react";

const FinishedBookItem = (props) => {
    const title = props.properties.Title.title[0]?.plain_text;
    const author = props.properties.Author.rich_text[0]?.plain_text;
    const link = props.properties.Link?.url;
    const cover = props.properties.Image.files[0]?.file.url;
    const status = props.properties.Status.select.name;
    const categoriesNames = props.properties.Category.multi_select?.map(c => c.name);

    const slug = slugify(title, {lower: true})
    // const description = obj.properties.Description.rich_text[0]?.plain_text;
    // const author = undefined;
    // const href = `/${obj.properties.Slug.rich_text[0]?.plain_text}`;

    return (
        <Box minW={0} margin={0}>
            <motion.div whileHover={{y: -3}}>
                <a href={`books/${slug}`}>
                    <Image
                        layout={"responsive"}
                        src={cover || "https://via.placeholder.com/160x240?text=Capa+indisponivel"}
                        width={160}
                        height={240}/>
                </a>
            </motion.div>
            <Text href={`books/${slug}`} size={"md"} fontWeight={"bold"} mt={2}>
                {title}
            </Text>
            <Text display={"block"} href={`books/${slug}`} opacity={0.6} mt={2}>
                {author}
            </Text>
        </Box>
    )
}

const UnfinishedBookItem = (props) => {
    const title = props.properties.Title.title[0]?.plain_text;
    const author = props.properties.Author.rich_text[0]?.plain_text;
    const link = props.properties.Link?.url;
    const cover = props.properties.Image.files[0]?.file.url;
    const status = props.properties.Status.select.name;
    const categoriesNames = props.properties.Category.multi_select?.map(c => c.name);

    const slug = slugify(title, {lower: true})
    // const description = obj.properties.Description.rich_text[0]?.plain_text;
    // const author = undefined;
    // const href = `/${obj.properties.Slug.rich_text[0]?.plain_text}`;

    return (
        <Box minW={0} margin={0}>
            <Image
                layout={"responsive"}
                src={cover || "https://via.placeholder.com/160x240?text=Capa+indisponivel"}
                width={160}
                height={240}/>

            <Text href={`books/${slug}`} size={"md"} fontWeight={"bold"} mt={2}>
                {title}
            </Text>
            <Text display={"block"} href={`books/${slug}`} opacity={0.6} mt={2}>
                {author}
            </Text>
        </Box>
    )
}

const Books = ({finishedBooks, unfinishedBooks}) => {

    return (
        <Page>
            <PageHeader title={`Livros finalizados`}
                        description={`Essa página contém as resenhas de ${finishedBooks.length} livros. Clique no livro para visualizar.`}/>

            <Grid templateColumns={["repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={{base: "20px", sm: "40px"}}
                  mb={"50px"}>
                {finishedBooks && finishedBooks.map((obj) => <FinishedBookItem key={obj.id} {...obj}/>)}
            </Grid>

            <PageHeader title={`Livros na fila`}
                        description={`Atualmente existem ${unfinishedBooks.length} livros na fila de espera`}/>

            <Grid templateColumns={["repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={{base: "20px", sm: "40px"}}
                  mb={"50px"}>
                {unfinishedBooks && unfinishedBooks.map((obj) => <UnfinishedBookItem key={obj.id} {...obj}/>)}
            </Grid>
        </Page>
    )
}

export async function getStaticProps(context) {

    const postsMeta = await getDatabase(process.env.NOTION_BOOK_DATABASE_ID);

    const finished = postsMeta.filter(b => b.properties.Status.select.name === "Done");
    const notFinished = postsMeta.filter(b => b.properties.Status.select.name !== "Done");


    if (!postsMeta) {
        return {
            notFound: true,
        }
    }


    return {
        props: {
            finishedBooks: finished,
            unfinishedBooks: notFinished,
        },
        revalidate: 1,
    }
}

export default Books;
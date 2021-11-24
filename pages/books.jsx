import Header from "../components/header";
import Page from "../components/page";
import PageHeader from "../components/page-header";
import {getDatabase} from "../lib/notionApi";
import Image from "next/image";
import slugify from "slugify";
import {motion} from "framer-motion";
import {Box, Grid, Heading, HStack, Link, LinkOverlay, Text, useColorModeValue as mode, VStack} from "@chakra-ui/react";
import BookSuggestion from "../components/book-suggestion";
import React, {Fragment} from "react";
import Rating from "../components/rating";
import {format, render, cancel, register} from "timeago.js";
import {formatDigits} from "../lib/stringUtils";

const BookItem = (props) => {
    const title = props.properties.Title.title[0]?.plain_text;
    const author = props.properties.Author.rich_text[0]?.plain_text;
    const rating = props.properties.Rating?.rich_text[0]?.plain_text;
    const link = props.properties.Link?.url;
    const cover = props.properties.Image.files[0]?.file.url;
    const status = props.properties.Status.select.name;
    const categoriesNames = props.properties.Category.multi_select?.map(c => c.name);
    const lastReadDate = props.properties.LastReadDate?.date?.start;
    const finished = props.finished;

    const LinkOrFragment = ({children, isFinished, slug, ...props}) => {
        if (isFinished)
            return <Link {...props} href={`books/${slug}`}>{children}</Link>;

        return <Fragment>{children}</Fragment>
    }

    const LinkOrText = ({children, isFinished, ...props}) => {
        if (isFinished)
            return <Link {...props} >{children}</Link>;

        return <Text {...props}>{children}</Text>
    }

    const slug = slugify(title, {lower: true})
    // const description = obj.properties.Description.rich_text[0]?.plain_text;
    // const author = undefined;
    // const href = `/${obj.properties.Slug.rich_text[0]?.plain_text}`;

    return (
        <HStack
            p={4}
            bg={mode("gray.50", "gray.800")}
            rounded="xl"
            borderWidth="1px"
            borderColor={mode("gray.300", "gray.700")}
            w="100%"
            textAlign="left"
            align="start"
            spacing={4}
            height={36}
            position="relative"
            transition="all 0.25s"
            transition-timing-function="spring(1 100 10 10)"
            _hover={{transform: "translateY(-4px)", shadow: "sm"}}
        >
            <Box
                rounded="md"
                h="144px"
                w="90px"
                overflow="hidden"
                shadow="lg"
                position="absolute"
                bottom={4}
            >
                <LinkOrFragment isFinished={finished} slug={slug}>
                    <Image
                        src={cover || "https://via.placeholder.com/160x240?text=Capa+indisponivel"}
                        height={96}
                        width={60}
                        layout="responsive"
                    />
                </LinkOrFragment>
            </Box>
            <VStack
                align="start"
                justify="flex-start"
                spacing={1}
                maxW="lg"
                pl={24}
                h="100%"
            >
                <VStack spacing={0} align="start" flexGrow="1">
                    <LinkOrText isFinished={finished} href={`books/${slug}`} fontWeight="bold" fontSize="md"
                                noOfLines={2}>
                        {title}
                    </LinkOrText>
                    <Text
                        fontSize="md"
                        color={mode("gray.500", "gray.200")}
                    >
                        {author}
                    </Text>
                </VStack>
                {finished &&
                <VStack spacing={0} align="start">
                    <Rating rating={parseInt(rating)}/>
                    {lastReadDate &&
                    <Text fontSize="xs" opacity={0.5}>
                        Lido {format(lastReadDate, "pt_BR")}
                    </Text>}
                </VStack>
                }
            </VStack>
        </HStack>
    )
}

const Books = ({finishedBooks, readingNow, waitingToBeRead}) => {

    return (
        <Page>
            <PageHeader title={`Livros`}
                        description={`Já terminei a leitura e resenha de ${finishedBooks ? formatDigits(finishedBooks.length, 2) : 0} livros. Clique no livro para visualizar.`}>
                <BookSuggestion/>
            </PageHeader>


            <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={{base: "20px", sm: "40px"}}
                  mb={"50px"}>
                {finishedBooks && finishedBooks.map((obj) => <BookItem finished={true} key={obj.id} {...obj}/>)}
            </Grid>

            <PageHeader title={`Lendo agora`}
                        description={`Atualmente estou lendo ${readingNow ? readingNow.length : 0} livros.`}/>

            <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={{base: "20px", sm: "40px"}}
                  mb={"50px"}>
                {readingNow && readingNow.map((obj) => <BookItem finished={false} key={obj.id} {...obj}/>)}
            </Grid>

            <PageHeader title={`Livros na fila`}
                        description={`Atualmente existem ${waitingToBeRead ? formatDigits(waitingToBeRead.length, 2) : 0} livros na fila de espera`}/>

            <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={{base: "20px", sm: "40px"}}
                  mb={"50px"}>
                {waitingToBeRead && waitingToBeRead.map((obj) => <BookItem finished={false} key={obj.id} {...obj}/>)}
            </Grid>
        </Page>
    )
}

export async function getStaticProps(context) {

    const postsMeta = await getDatabase(process.env.NOTION_BOOK_DATABASE_ID);

    const finished = postsMeta.filter(b => b.properties.Status.select.name === "Done");
    const reading = postsMeta.filter(b => b.properties.Status.select.name === "Reading");
    const waiting = postsMeta.filter(b => b.properties.Status.select.name === "Waiting");


    if (!postsMeta) {
        return {
            notFound: true,
        }
    }


    return {
        props: {
            finishedBooks: finished,
            readingNow: reading,
            waitingToBeRead: waiting,
        },
        revalidate: 1,
    }
}

export default Books;
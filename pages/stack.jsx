import Page from "../components/page";
import PageHeader from "../components/page-header";
import {Box, Grid, Heading, Link as CLink, Tag, Text} from "@chakra-ui/react";
import Image from "next/image";
import {HiLink} from "react-icons/hi";
import ToolCard from "../components/tool-card";

const Stack = ({items}) => {
    return (
        <Page>
            <PageHeader title={"Stack"} description={"Todas as ferramentas que uso pra produzir."}/>
            {items
                ?
                <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={{base: "20px", sm: "40px"}}>
                    {items.map(({Name, Description, Logo, Platform, Link}, idx) => (
                        <ToolCard
                            key={idx}
                            name={Name}
                            description={Description}
                            image={Logo}
                            platform={Platform}
                            link={Link}
                        />
                    ))}
                </Grid>
                : <Text>Ainda sem informações.</Text>
            }
        </Page>
    )
}

export const getStaticProps = async context => {

    const base = require('airtable').base(process.env.AIRTABLE_TABLE_ID);
    const records = await base("Stack").select({}).all();

    const filteredRecords = records.filter(f => f.fields?.Name !== undefined)
        .map((item) => item.fields);

    return {
        props: {
            items: [...filteredRecords],
        },
        revalidate: 1,
    }
}

export default Stack;
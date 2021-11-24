import Page from "../components/page";
import Head from 'next/head';
import PageHeader from "../components/page-header";
import {Button, Link} from "@chakra-ui/react";

const Custom404 = () => (
    <Page>
        <Head>
            <title>404 | Samuel Kraft</title>
        </Head>
        <PageHeader
            title="404 - Página não encontrada"
            description="Ops! Essa página não existe mais. Provavelmente é um link antigo. Desculpe."
        >
        </PageHeader>
            <Link mt={5} href="/">Voltar</Link>
    </Page>
)

export default Custom404

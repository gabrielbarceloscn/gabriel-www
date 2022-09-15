import Head from 'next/head'
import Image from 'next/image'
import {Avatar, Box, Container, Heading, HStack, Text} from "@chakra-ui/react";
import Header from "../components/header";
import Page from "../components/page";
import PageHeader from "../components/page-header";

import CnAppBanner from "../public/projects/caldasnovas-app-v2.png";
import Project from "../components/project";
import {NextSeo} from "next-seo";

const projects = [
    { title: 'Caldas Novas App', description: 'O aplicativo oficial de Caldas Novas - GO', link: 'https://caldasnovas.app', image: CnAppBanner },
]

export default function Home({}) {
    const seoDescription = "Sou um desenvolvedor & empreendedor. Esse é meu site pessoal, e uso ele como um espaço para compartilhar projetos, leitura dentre outros.";

    return (
        <Page>
            <NextSeo
                description={seoDescription}
                />
            <PageHeader title={"Olá, me chamo Gabriel."} description={seoDescription}/>
            <Heading as="h3" size="lg">Projetos</Heading>
            {projects.map(proj => (
                <Project key={proj.title} {...proj}/>
            ))}
        </Page>
    )
}

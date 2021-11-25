import Head from 'next/head'
import Image from 'next/image'
import {Avatar, Box, Container, Heading, HStack, Text} from "@chakra-ui/react";
import Header from "../components/header";
import Page from "../components/page";
import PageHeader from "../components/page-header";

import CnAppBanner from "../public/projects/caldasnovas-app.png";
import Project from "../components/project";

const projects = [
    { title: 'Caldas Novas App', description: 'O aplicativo oficial de Caldas Novas - GO', link: 'https://caldasnovas.app', image: CnAppBanner },
]

export default function Home({}) {
    return (
        <Page>
            <PageHeader title={"Olá, me chamo Gabriel."} description="Sou um desenvolvedor  &amp; empreendedor. Esse é meu site pessoal, e uso ele como um espaço para armazenar informações importantes."/>
            <Heading as="h3" size="lg">Projetos</Heading>
            {projects.map(proj => (
                <Project key={proj.title} {...proj}/>
            ))}
        </Page>
    )
}

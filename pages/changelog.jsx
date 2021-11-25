import Page from "../components/page";
import PageHeader from "../components/page-header";
import styles from './changelog.module.scss';
import cn from "classnames";
import {formatDate} from "../lib/formatDate";
import {NextSeo} from 'next-seo';
import {Link} from "@chakra-ui/react";

const Entry = ({title, date, children, type = 'isDone'}) => {
    return (
        <section className={cn(styles.entry, styles[type])}>
            <h2 className={styles.title}>{title}</h2>
            <span className={styles.meta}>
        {date && (
            <time dateTime={date} className={styles.date}>
                {type === 'inProgress' && 'Started '}
                {formatDate(date)}
            </time>
        )}
                <span className={styles.separator}>·</span>
      </span>
            {children && <div className={styles.content}>{children}</div>}
        </section>
    )
}

const Changelog = () => {
    const seoTitle = 'Changelog | Gabriel Barcelos'
    const seoDesc = "Alterações no código fonte do site."

    return (
        <Page>
            <NextSeo
                title={seoTitle}
                description={seoDesc}
                openGraph={{
                    title: seoTitle,
                    url: `https://gabrielbarcelos.com.br/changelog/`,
                    description: seoDesc,
                    site_name: 'Gabriel Barcelos',
                    images: [
                        {
                            url: `https://og-image.vercel.app/Changelog%20%7C%20Gabriel%20Barcelos.jpeg?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-black.svg&images=https%3A%2F%2Fgabrielbarcelos.com.br%2Favatar-small.jpg`,
                            // url: `https://og-image.samuelkraft.vercel.app/Changelog?desc=${encodeURIComponent(seoDesc)}&theme=dark.png`,
                            alt: seoTitle,
                        },
                    ],
                }}
                twitter={{
                    cardType: 'summary_large_image',
                }}
            />
            <PageHeader
                title={"Changelog"}
                description={"Histórico de alterações"}
            />
            <section className={styles.section}>
                <Entry date="2021/11/25" title="⚡️ Publicação definitiva!">
                    <p>Esse site usa a seguinte stack:</p>
                    <ul>
                        <li><Link href={"https://nextjs.org/"} isExternal>NextJS</Link>: geração estática de páginas.</li>
                        <li><Link href={"https://chakra-ui.com/"} isExternal>Chakra-UI</Link>: biblioteca de componentes simples, modular e preocupada com acessibilidade.</li>
                        <li><Link href={"https://notion.so"} isExternal>Notion.so</Link>: uso ele como repositório de posts pro blog.</li>
                        <li><Link href={"https://raindrop.io/"} isExternal>Raindrop.io</Link>: gestão de bookmarks. importo pro site via api.</li>
                        <li><Link href={"https://www.airtable.com/"} isExternal>Airtable</Link>: plataforma colaborativa orientada a dados.</li>
                    </ul>
                </Entry>
                <Entry date="2021/11/24" title="🚀 Versão inicial">
                    <p>
                        Primeira versão da repaginação do site.
                    </p>
                </Entry>
            </section>

        </Page>
    )
}

export default Changelog;
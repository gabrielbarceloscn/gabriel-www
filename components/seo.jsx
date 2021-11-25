import { DefaultSeo } from 'next-seo'

const config = {
    title: 'Gabriel Barcelos - Programador & Empreendedor',
    description: 'Meu projeto mais recente é o app oficial de Caldas Novas.',
    openGraph: {
        type: 'website',
        locale: 'pt_br',
        url: 'https://gabrielbarcelos.com.br',
        site_name: 'Gabriel Barcelos',
        images: [
            {
                url: 'https://gabrielbarcelos.com.br/og.jpg',
                alt: 'Gabriel Barcelos',
            },
        ],
    },
    twitter: {
        handle: '@gabrielrb',
        site: '@gabrielrb',
        cardType: 'summary_large_image',
    },
}

const SEO = () => {
    return <DefaultSeo {...config} />
}

export default SEO;
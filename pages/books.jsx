import Header from "../components/header";
import Page from "../components/page";
import PageHeader from "../components/page-header";

const BookItem = (props) => {
    return (
        <div>...</div>
    )
}

const Books = ({books}) => {

    return (
        <Page>
            <PageHeader title={"Livros"}
                description={"Livros que estão na lista de leitura, e livros lidos (com comentários)."}/>

            {books.map((obj) => (
                <div key={obj.Title}>{obj.Title}</div>
            ))}
        </Page>
    )
}

export async function getStaticProps(context) {

    const res = await fetch(`https://notion-api.splitbee.io/v1/table/816f819d6d99473d9bca422569b2cd6a`);
    const data = await res.json();

    if (!data) {
        return {
            notFound: true,
        }
    }


    return {
        props: {
            books: data,
        },
        revalidate: 1,
    }
}

export default Books;
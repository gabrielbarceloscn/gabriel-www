import React, {Fragment} from "react";
import Image from "next/image";
import {Box, Button, Heading, HStack, Link, Text} from "@chakra-ui/react";
import {FaDownload} from "react-icons/fa";

export const NotionText = ({text}) => {
    if (!text) {
        return null;
    }
    return text.map((value, idx) => {
        const {
            annotations: {bold, code, color, italic, strikethrough, underline},
            text,
        } = value;

        let as = "";

        // return (
        //     <Text key={idx} as={(italic ? "i" : undefined) || (underline ? "u" : undefined)}>
        //         {text.content}
        //     </Text>
        // )

        return (
            <Box display={"inline"} fontWeight={(bold ? "bold": "normal")}
                 fontStyle={(italic ? "italic" : "normal")}
                 textDecoration={(strikethrough? "line-through" : undefined) || (underline ? "underline": undefined)}
                 key={idx}
                 color={color !== "default" ? color : undefined}
            >
                {text.link ? <Link color={"blue.500"} textDecoration={"underline"} fontWeight={"bold"} href={text.link.url}>{text.content}</Link> : text.content}
            </Box>
        );
    });
};

export const NotionImageFile = ({data, alt}) => {

    /*
        Expected:
        "cover": {
            "type": "file",
            "file": {
              "url": "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/529c5d26-e39f-4b0c-93af-d42e39ca36dd/150742098_500540104681817_5086441279661538497_n.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20211003%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211003T214754Z&X-Amz-Expires=3600&X-Amz-Signature=c8b8fd70f20809a54fbf931faf4086a72a1287342b5f3c7ab529e1590a2f7814&X-Amz-SignedHeaders=host",
              "expiry_time": "2021-10-03T22:47:54.317Z"
            }
          },
     */

    if (!data || data.type !== "file")
        return (
            <></>
        )

    return (
        <Box
            pos="relative"
            // cursor="pointer"
            className="group"
            h={{
                base: '12rem',
                md: '30rem',
            }}
            overflow="hidden"
        >
            <Image src={data.file.url} alt={alt} layout={"fill"} />
        </Box>
    )
}

export const NotionBlockRender = (block) => {
    const {type, id} = block;
    const value = block[type];

    switch (type) {
        case "paragraph":
            return (
                <Box as={"p"} marginY={1}>
                    {value.text.length > 0
                        ? <NotionText text={value.text}/>
                        : <br/>
                    }
                </Box>
            );
        case "heading_1":
            return (
                <Heading as={"h1"} size={"xl"} marginTop={6} marginBottom={2}>
                    <NotionText text={value.text}/>
                </Heading>
            );
        case "heading_2":
            return (
                <Heading as={"h2"} size="lg" marginTop={3} marginBottom={1}>
                    <NotionText text={value.text}/>
                </Heading>
            );
        case "heading_3":
            return (
                <Heading as={"h3"} size="md" marginTop={2} marginBottom={1}>
                    <NotionText text={value.text}/>
                </Heading>
            );
        case "bulleted_list_item":
        case "numbered_list_item":
            return (
                <li>
                    <NotionText text={value.text}/>
                </li>
            );
        case "to_do":
            return (
                <div>
                    <label htmlFor={id}>
                        <input type="checkbox" id={id} defaultChecked={value.checked}/>{" "}
                        <NotionText text={value.text}/>
                    </label>
                </div>
            );
        case "toggle":
            return (
                <details>
                    <summary>
                        <NotionText text={value.text}/>
                    </summary>
                    {value.children?.map((block) => (
                        <Fragment key={block.id}>{renderBlock(block)}</Fragment>
                    ))}
                </details>
            );
        case "child_page":
            return <p>{value.title}</p>;
        case "image":
            const src =
                value.type === "external" ? value.external.url : value.file.url;
            const caption = value.caption ? value.caption[0]?.plain_text : "";
            return (
                <figure>
                    <img src={src} alt={caption}/>
                    {caption && <figcaption>{caption}</figcaption>}
                </figure>
            );
        case "file":
            const fileCaption = value.caption ? value.caption[0]?.plain_text : "";
            const fileUrl = value.file?.url;
            return (
                <Button as={"a"} href={fileUrl} target={"_blank"} variant={"outline"} colorScheme={"blue"} leftIcon={FaDownload}>
                    Baixar arquivo {fileCaption}
                </Button>
            )
        case "unsupported":
            const isImageFile = block?.image?.type === "file";
            if (isImageFile){
                const fileUrl = block.image.file.url;

                return (
                    <img src={fileUrl} alt={"imagem"} />
                )
            }

            return `❌ Unsupported block (${
                type === "unsupported" ? "unsupported by Notion API" : type
            })`;
        default:
            return `❌ Unsupported block (${
                type === "unsupported" ? "unsupported by Notion API" : type
            })`;
    }
};
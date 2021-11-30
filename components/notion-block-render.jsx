import React, {Fragment} from "react";
import Image from "next/image";
import {Alert, Box, Button, Divider, Heading, HStack, Link, Text, Image as CImage} from "@chakra-ui/react";
import {FaDownload} from "react-icons/fa";
import YoutubeEmbed from "./youtube-embed";
import cloudinaryCustomLoader from "../lib/imgCustomLoader";

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
            <Box as={"span"} display={"inline"} fontWeight={(bold ? "bold" : "normal")}
                 fontStyle={(italic ? "italic" : "normal")}
                 textDecoration={(strikethrough ? "line-through" : undefined) || (underline ? "underline" : undefined)}
                 key={idx}
                 color={color !== "default" ? color : undefined}
            >
                {text.link ?
                    <Link isExternal={true} colorScheme={"brand"} textDecoration={"underline"} fontWeight={"bold"}
                          href={text.link.url}>{text.content}</Link> : text.content}
            </Box>
        );
    });
};

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
            if (src === undefined) {
                return (
                    <></>
                )
            }

            return (
                <>
                    <CImage src={cloudinaryCustomLoader({src})} alt={caption}/>
                    {caption && <Text>{caption}</Text>}
                </>
            );
        case "file":
            const fileCaption = value.caption ? value.caption[0]?.plain_text : "";
            const fileUrl = value.file?.url;
            return (
                <Button as={"a"} href={fileUrl} target={"_blank"} variant={"outline"} colorScheme={"blue"}
                        leftIcon={FaDownload}>
                    Baixar arquivo {fileCaption}
                </Button>
            )
        case "video":
            const videoType = value.type;
            if (videoType === "external") {
                const externalUrl = value.external.url;
                const getYoutubeVideoId = (url) => {
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                    const match = url.match(regExp);

                    return (match && match[2].length === 11)
                        ? match[2]
                        : null;
                }
                return (
                    <div>
                        <YoutubeEmbed embedId={getYoutubeVideoId(externalUrl)}/>
                    </div>
                )
            }
            return (
                <>unsupported video</>
            )
        case "bookmark":
            const bookmarkUrl = value.url;
            return (
                <Link href={bookmarkUrl}>{bookmarkUrl}</Link>
            )
        case "divider":
            return (
                <Divider/>
            )
        case "callout":
            const calloutText = value.text[0].plain_text;
            return (
                <Alert colorScheme={"gray"}>
                    {calloutText}
                </Alert>
            )
        case "unsupported":
            const isImageFile = block?.image?.type === "file";
            if (isImageFile) {
                const fileUrl = block.image.file.url;

                return (
                    <img src={fileUrl} alt={"imagem"}/>
                )
            }

            return `❌ Unsupported block (${
                type === "unsupported" ? "unsupported by Notion API" : type
            })`;
        default:
            return `🔹 Not rendered block. (${
                type === "unsupported" ? "unsupported by Notion API" : type
            })`;
    }
};
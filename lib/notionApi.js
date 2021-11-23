const { Client } = require("@notionhq/client");


const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async (id) => {
    const response = await notion.databases.query({
        database_id: id,
    });
    return response.results;
};


export const getPage = async (pageId) => {
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
};

export const getBlocks = async (pageId) => {
    const response = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 50,
    });
    return response.results;
};

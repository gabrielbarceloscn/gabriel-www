const { Client } = require("@notionhq/client");


const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async (id) => {
    let customArgs = {
        database_id: id,
    }

    let results = [];
    let data = await notion.databases.query(customArgs);

    results = [...data.results];

    while (data.has_more){
        data = await notion.databases.query({
            ...customArgs,
            start_cursor: data.next_cursor,
        })
        results = [...results, data.results];
    }

    return results;
};

export const getPage = async (pageId) => {
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
};

export const getBlocks = async (pageId) => {
    let customArgs = {
        block_id: pageId,
        page_size: 100,
    };

    let results = []
    let data = await notion.blocks.children.list(customArgs);
    results = [...data.results];

    while (data.has_more){
        data = await notion.blocks.children.list({
            ...customArgs,
            start_cursor: data.next_cursor,
        });
        results = [...results, ...data.results];
    }

    return results;
};

export default async function handler(req, res) {

    const Airtable = require('airtable');
    const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_TABLE_ID);
    const data = req.body;

    base('BookSuggestion').create({
        "Title": data.title,
        "Message": data.message,
        "Author": data.author,
    }, function(err, record) {
        if (err) {
            console.error(err);

            res.status(500).json({ message: `Erro ${err}.`});
            return;
        }

        res.status(200).json({id: record.getId()});
    });

}

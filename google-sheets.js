const { google } = require('googleapis');
// const keys = require('./keys.json');
require('dotenv').config({ path: './TEST.env' })

// const client = new google.auth.JWT(
//     keys.client_email,
//     null,
//     keys.private_key,
//     ['https://www.googleapis.com/auth/spreadsheets']
// );

const client = new google.auth.JWT(
    process.env.client_email,
    null,
    process.env.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

async function getDataFromSheet(sheetId) {
    try {
        const sheets = google.sheets({ version: 'v4', auth: client });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'Sheet9' // Replace with the sheet name or range you want to retrieve data from
        });
        const rows = response.data.values;
        return rows;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getDataFromSheet };

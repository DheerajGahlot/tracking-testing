// const express = require('express');
// const cors = require('cors');
// const { getDataFromSheet } = require('./google-sheets');
// const app = express();
// app.use(cors());

// const port = process.env.PORT || 5000;

// app.get('/items/:category/:subcategory', async (req, res) => {
//     const category = req.params.category;
//     const subcategory = req.params.subcategory;
//     let data = await getDataFromSheet('1GI7rgBl2ziVPUR-wtK-7E2-psdIAOywjAf5N2IJANBI');
//     data.shift();
//     console.log(data);
//     if (category === "all") {
//         // const filteredData = data.filter(row => row[2].toLowerCase() === subcategory);
//         res.json(data);
//     }
//     else if (category === "fruits") {
//         if (subcategory === "all") {
//             const filteredData = data.filter(row => row[7].toLowerCase() === category);
//             res.json(filteredData);
//         }
//         else {
//             const filteredData = data.filter(row => row[8].toLowerCase() === subcategory);
//             res.json(filteredData);
//         }
//     }
//     else if (category === "vegetable") {
//         if (subcategory === "all") {
//             const filteredData = data.filter(row => row[7].toLowerCase() === category);
//             res.json(filteredData);
//         }
//         else {
//             const filteredData = data.filter(row => row[8].toLowerCase() === subcategory);
//             res.json(filteredData);
//         }
//     }
//     else if (category === "shopno") {
//         const filteredData = data.filter(row => row[2].toLowerCase() === subcategory.toLowerCase());
//         res.json(filteredData);
//     }
// });

// app.listen(port, () => {
//     console.log(`Server started on port ${port}`);
// });

 
 

 

 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const { google } = require('googleapis');
require('dotenv').config({ path: './TEST.env' })
const client = new google.auth.JWT(
    process.env.client_email,
    null,
    process.env.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

const port = process.env.PORT || 5000;

app.get('/items/:category/:subcategory', async (req, res) => {
  const category = req.params.category;
  const subcategory = req.params.subcategory;

  
    const sheets = google.sheets({ version: 'v4', auth: client });
    // Fetch static data from data sheet
    const response1 = await sheets.spreadsheets.values.get({
        spreadsheetId: '1GI7rgBl2ziVPUR-wtK-7E2-psdIAOywjAf5N2IJANBI',
        range: 'Static' // Replace with the sheet name or range you want to retrieve data from
    });
     
    const staticData = response1.data.values;
    // Fetch dynamic data from Google Sheets
    const  response2 = await sheets.spreadsheets.values.get({
        spreadsheetId: '1GI7rgBl2ziVPUR-wtK-7E2-psdIAOywjAf5N2IJANBI',
        range: 'Dynamic_tobedispalyed' // Replace with the sheet name or range you want to retrieve data from
    });
    const dynamicData = response2.data.values;
const data = [];

// Loop through the static data
for (var i = 1; i < staticData.length; i++) {
  var staticRow = staticData[i];
   
  
  // Loop through the dynamic data
  for (var j = 1; j < dynamicData.length; j++) {
    var dynamicRow = dynamicData[j];
    
    // Check if the mobile number matches
    if (staticRow[7] === dynamicRow[1]) {
      // Merge the dynamic data into the merged row
      var matrix = [ staticRow[0] , staticRow[1] , staticRow[2] , staticRow[3] ,staticRow[4],staticRow[5] ,staticRow[6],dynamicRow[2],dynamicRow[3],dynamicRow[4],dynamicRow[5],dynamicRow[6],staticRow[7],staticRow[8]];
      data.push(matrix);
    }
  }
}

 



    // Apply category and subcategory filters
     
    if (category === "सभी") {
                // const filteredData = data.filter(row => row[2].toLowerCase() === subcategory);
                res.json(data);
            }
            else if (category === "फल") {
                if (subcategory === "सभी") {
                    const filteredData = data.filter(row => row[7].toLowerCase() === category);
                    res.json(filteredData);
                }
                else {
                    const filteredData = data.filter(row => row[8].toLowerCase() === subcategory);
                    res.json(filteredData);
                }
            }
            else if (category === "सब्ज़ी") {
                if (subcategory === "सभी") {
                    const filteredData = data.filter(row => row[7].toLowerCase() === category);
                    res.json(filteredData);
                }
                else {
                    const filteredData = data.filter(row => row[8].toLowerCase() === subcategory);
                    res.json(filteredData);
                }
            }
            else if (category === "shopno") {
                const filteredData = data.filter(row => row[2].toLowerCase() === subcategory.toLowerCase());
                res.json(filteredData);
            }
});


app.post('/MessageReceived', async (req, res) => {
    try {
      // Access the data from the request body
        res.send('ok');
    var  Time  = req.body.created;
    var SenderNAme = req.body.senderName;
    var SenderWatNo = req.body.waId;
    var Content = req.body.text;
    if(Content==null)
    {
        Content = req.body.listReply.title
    }
    var Contenttype = req.body.type;
    var EventType =  req.body.eventType;
    var StatusString = req.body.statusString;
    

      // Create a new instance of the Google Sheets API
      const sheets = google.sheets({ version: 'v4', auth: client });
  
      // Define the spreadsheet ID and range
      const spreadsheetId = '1GI7rgBl2ziVPUR-wtK-7E2-psdIAOywjAf5N2IJANBI';
      const range = 'Sheet20';
  
      // Prepare the data to be written
      var values = [[Time,SenderNAme,SenderWatNo,Content,Contenttype,EventType,StatusString]];
  
      // Write the data to the spreadsheet
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

    } catch (error) {
      console.error('Error storing data in Google Sheets:', error);

    }
  });

  app.post('/MessageReplied', async (req, res) => {
    try {
      // Access the data from the request body
        res.send('ok');
  
    var SenderNAme = req.body.operatorName;
    var Content = req.body.text;
    var Contenttype = req.body.type;
    var EventType =  req.body.eventType;
    var StatusString = req.body.statusString;
    var  receiever = req.body.waId;
    
  
      // Create a new instance of the Google Sheets API
      const sheets = google.sheets({ version: 'v4', auth: client });
  
      // Define the spreadsheet ID and range
      const spreadsheetId = '1GI7rgBl2ziVPUR-wtK-7E2-psdIAOywjAf5N2IJANBI';
      const range = 'Sheet21';
  
      // Prepare the data to be written
      var values = [[SenderNAme,Content,Contenttype,EventType,StatusString,receiever]];
  
      // Write the data to the spreadsheet
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });
  
    } catch (error) {
      console.error('Error storing data in Google Sheets:', error);
  
    }
  });
 

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const csvtojson = require('csvtojson');
const excelToJson = require('convert-excel-to-json');
var cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5001;
// mongodb+srv://prateekjain550:s1ZyLXOPEoKBh7mR@cluster0.a8vtszt.mongodb.net/?retryWrites=true&w=majority&dbname=Aisensy
// Connect to MongoDB
mongoose.connect('mongodb+srv://prateekjain550:s1ZyLXOPEoKBh7mR@cluster0.a8vtszt.mongodb.net/?retryWrites=true&w=majority&dbname=Aisensy', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

// Define Contact schema
const contactSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
  // Other relevant fields
});
app.use(cors());

const Contact = mongoose.model('contact', contactSchema);

// Middleware for parsing JSON
app.use(bodyParser.json());

// Multer configuration for file upload
const upload = multer({ dest: 'uploads/' });

// API endpoint for contact import
// app.post('/api/import-contacts', upload.single('file'), async (req, res) => {
//   try {
//     const file = req.file;
//     let contacts;

//     if (file.mimetype === 'text/csv') {
//       // Parse CSV file
//       contacts = await csvtojson().fromFile(file.path);
//     } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       // Parse Excel file
//       const result = excelToJson({
//         sourceFile: file.path,
//       });

//       contacts = result.Sheet1; // Adjust sheet name accordingly
//     } else {
//       throw new Error('Invalid file format');
//     }

//     // Save contacts to MongoDB
//     await Contact.insertMany(contacts);

//     res.status(200).json({ message: 'Contacts imported successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error importing contacts' });
//   }
// });

app.post('/contacts', async (req, res) => {
  try {
    // Assuming req.body contains an array of contact objects
    const contacts = req.body;

    if (!contacts || !Array.isArray(contacts)) {
      throw new Error('Invalid request body');
    }

    // Save contacts to MongoDB Atlas without any additional processing
    await Contact.insertMany(contacts);

    res.status(200).json({ message: 'Contacts imported successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error importing contacts' });
  }
});

// API endpoint for paginated contact listing
// API endpoint for paginated contact listing
// server.js

// ... (existing imports)

app.get('/api/contacts', async (req, res) => {
  const { page = 1, contactsPerPage = 10 } = req.query;
  const skip = (page - 1) * contactsPerPage;

  try {
    // Fetch total count of contacts
    const totalContacts = await Contact.countDocuments();

    // Use the find method to retrieve contacts from MongoDB Atlas
    const contactList = await Contact.find().skip(skip).limit(parseInt(contactsPerPage));

    res.status(200).json({
      contacts: contactList,
      totalContacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching contacts' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
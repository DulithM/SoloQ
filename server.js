// Import necessary modules
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize the app
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Set up multer for file uploads
const upload = multer({
    dest: 'uploads/'
});

// In-memory storage for subjects
let subjects = [];

// Endpoint to upload study materials
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Rename the file with its original name
    const originalName = req.file.originalname;
    const targetPath = path.join(__dirname, 'uploads', originalName);

    fs.rename(req.file.path, targetPath, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error saving the file' });
        }
        res.json({ message: 'File uploaded successfully', fileName: originalName });
    });
});

// Endpoint to add a new subject
app.post('/subjects', (req, res) => {
    const { subject } = req.body;

    if (!subject) {
        return res.status(400).json({ message: 'Subject name is required' });
    }

    if (subjects.includes(subject)) {
        return res.status(400).json({ message: 'Subject already exists' });
    }

    subjects.push(subject);
    res.json({ message: 'Subject added successfully', subjects });
});

// Endpoint to get all subjects
app.get('/subjects', (req, res) => {
    res.json({ subjects });
});

// Endpoint to generate practice questions
app.post('/generate-questions', (req, res) => {
    const { subject } = req.body;

    if (!subject) {
        return res.status(400).json({ message: 'Subject is required' });
    }

    if (!subjects.includes(subject)) {
        return res.status(404).json({ message: 'Subject not found' });
    }

    // Generate example questions (Replace this with AI integration)
    const questions = [
        `What are the key concepts of ${subject}?`,
        `Explain the main ideas behind ${subject}.`,
        `List three examples related to ${subject} and explain each.`
    ];

    res.json({ subject, questions });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

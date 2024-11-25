const fs = require('fs');
const path = require("path");
const uploadDir = path.join(__dirname, 'uploads');
const mysql = require("mysql2/promise");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const dotenv = require("dotenv");
const db = require('./db');
dotenv.config();

let uploadedFiles = [];

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Uploads folder created');
} else {
    console.log('Uploads folder already exists');
}

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email is already registered" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
      const values = [email, hashedPassword];
  
      const [result] = await db.query(query, values); 
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error('Error during registration:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, role: user[0].role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/upload", authenticateToken, upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  
    const userId = req.user.id;
  
    const fileData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      tags: null,
      viewCount: 0,
      shareableLink: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
      userId, 
    };
  
    try {
      await db.execute(
        "INSERT INTO files (filename, original_name, file_path, shareable_link, user_id) VALUES (?, ?, ?, ?, ?)",
        [fileData.filename, fileData.originalName, fileData.filePath, fileData.shareableLink, fileData.userId]
      );
  
      res.json({ message: "File uploaded successfully", file: fileData });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: "Database error" });
    }
  });

app.get("/uploads/:filename", (req, res) => {
  const file = uploadedFiles.find((f) => f.filename === req.params.filename);

  if (file) {
    file.viewCount += 1; 
    const filePath = path.join(__dirname, "uploads", req.params.filename);
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});
  

app.post("/add-tags", authenticateToken, async (req, res) => {
  const { filename, tags } = req.body;

  try {
    const [file] = await db.query("SELECT * FROM files WHERE filename = ?", [filename]);
    if (file.length === 0) return res.status(400).json({ message: "File not found" });

    await db.query("UPDATE files SET tags = ? WHERE filename = ?", [tags, filename]);

    res.json({ message: "Tags added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/uploads", authenticateToken, async (req, res) => {
  try {
    const [files] = await db.query("SELECT * FROM files");
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

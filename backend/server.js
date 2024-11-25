const fs = require('fs');
const path = require("path");
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Uploads folder created');
} else {
    console.log('Uploads folder already exists');
}

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize users with prehashed passwords
const initializeUsers = async () => {
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const hashedUserPassword = await bcrypt.hash("user123", 10);

  return [
    { id: 1, email: "admin@example.com", password: hashedAdminPassword, role: "admin" },
    { id: 2, email: "user@example.com", password: hashedUserPassword, role: "user" },
  ];
};

let users = [];
let uploadedFiles = []; // Store file metadata (filename, tags, and viewCount)

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const findUserByEmail = (email) => users.find((user) => user.email === email);

// Middleware to authenticate JWT token
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
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = findUserByEmail(email);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token, role: user.role });
});

// File upload route
app.post("/upload", authenticateToken, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const fileData = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    filePath: `/uploads/${req.file.filename}`,
    tags: [],
    viewCount: 0,  // Initialize the view count to 0
    shareableLink: `${req.protocol}://${req.get('host')}/uploads/share/${req.file.filename}`,
  };

  uploadedFiles.push(fileData);

  res.json({ message: "File uploaded successfully", file: req.file, shareableLink: fileData.shareableLink });
});

// Add tags to a file
app.post("/add-tags", authenticateToken, (req, res) => {
  const { filename, tags } = req.body;

  const file = uploadedFiles.find((file) => file.filename === filename);
  if (!file) return res.status(400).json({ message: "File not found" });

  file.tags = tags; // Add the provided tags to the file
  res.json({ message: "Tags added successfully", file });
});

// Get the list of uploaded files
app.get("/uploads", authenticateToken, (req, res) => {
  res.json(uploadedFiles); // Return all uploaded files with metadata
});

// Serve uploaded file from the server with view count increment
app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  const file = uploadedFiles.find((f) => f.filename === req.params.filename);

  if (file) {
    file.viewCount += 1;  // Increment view count each time file is accessed
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

// Shareable link route - allows non-logged-in users to view the file
app.get("/uploads/share/:filename", (req, res) => {
  const file = uploadedFiles.find((f) => f.filename === req.params.filename);

  if (file) {
    file.viewCount += 1;  // Increment view count
    const filePath = path.join(__dirname, "uploads", req.params.filename);
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

// Get statistics for a file
app.get("/uploads/stats/:filename", (req, res) => {
  const file = uploadedFiles.find((f) => f.filename === req.params.filename);

  if (file) {
    res.json({
      filename: file.filename,
      originalName: file.originalName,
      viewCount: file.viewCount,
      tags: file.tags,
    });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

// Start the server after initializing users
(async () => {
  users = await initializeUsers();

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})();

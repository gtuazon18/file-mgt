import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [tags, setTags] = useState("");
  
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    } else {
      alert("No files dropped.");
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: "",
    onDragOver: (e) => e.preventDefault(),
    onDragLeave: (e) => e.preventDefault(),
  });

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    setUploading(true);

    try {
      const res = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/upload",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data) {
        alert("File uploaded successfully!");
        setFile(null);
        fetchUploadedFiles();
      } else {
        alert("File upload failed. Please try again.");
      }
    } catch (error) {
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const addTags = async (filename) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/add-tags`,
        { filename, tags: tags.split(",") },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Tags added successfully!");
      fetchUploadedFiles();
      setTags("");
    } catch (error) {
      alert("Error adding tags");
    }
  };

  const fetchUploadedFiles = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/uploads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadedFiles(res.data);
    } catch (error) {
      alert("Error fetching uploaded files");
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const copyLinkToClipboard = (link) => {
    const textArea = document.createElement("textarea");
    textArea.value = link;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert("Link copied to clipboard!");
  };

  // Fallback to native file input when drag-and-drop doesn't work
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", p: 3, bgcolor: "#f5f5f5" }}
    >
      <Typography variant="h4" gutterBottom>
        File Upload
      </Typography>

      {/* Paper with Dropzone */}
      <Paper
        {...getRootProps()}
        elevation={3}
        sx={{
          p: 3,
          width: "100%",
          maxWidth: 600,
          textAlign: "center",
          cursor: "pointer",
          bgcolor: "#e0e0e0",
          border: "2px dashed #9e9e9e",
          ":hover": { borderColor: "#3f51b5", bgcolor: "#f4f6ff" },
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography variant="body1" color="primary">
            Drop the file here ...
          </Typography>
        ) : (
          <React.Fragment>
            <UploadFileIcon sx={{ fontSize: 50, color: "#757575" }} />
            <Typography variant="body1" mt={2}>
              Drag & drop a file here, or click to select one
            </Typography>
          </React.Fragment>
        )}
      </Paper>

      {/* File input fallback for browsers where drag-and-drop might not work */}
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        ref={(input) => (input ? input.click() : null)} // Auto-click input for file selection
      />

      {/* Display selected file and upload button */}
      {file && (
        <Box mt={3} textAlign="center">
          <Typography variant="body1" gutterBottom>
            Selected File: {file.name}
          </Typography>
          {uploading ? (
            <LinearProgress sx={{ mt: 2 }} />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={uploadFile}
              sx={{ mt: 2 }}
            >
              Upload File
            </Button>
          )}
        </Box>
      )}

      {/* Uploaded Files Table */}
      <Typography variant="h5" mt={5} gutterBottom>
        Uploaded Files
      </Typography>

      {uploadedFiles.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Filename</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>View Count</TableCell>
                <TableCell>Shareable Link</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {uploadedFiles.map((file) => (
                <TableRow key={file.filename}>
                  <TableCell>{file.original_name}</TableCell>
                  <TableCell>{file.tags}</TableCell>
                  <TableCell>{file.viewCount}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => copyLinkToClipboard(file.shareable_link)}
                    >
                      Copy Link
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <TextField
                        label="Add Tags"
                        variant="outlined"
                        size="small"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        sx={{ mr: 2 }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addTags(file.filename)}
                      >
                        Add Tags
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No files uploaded yet.
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;

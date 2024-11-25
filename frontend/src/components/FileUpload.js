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
    setFile(acceptedFiles[0]);
  };

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
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
        "http://localhost:5000/add-tags",
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
      const res = await axios.get("http://localhost:5000/uploads", {
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

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
        <UploadFileIcon sx={{ fontSize: 50, color: "#757575" }} />
        <Typography variant="body1" mt={2}>
          Drag & drop a file here, or click to select one
        </Typography>
      </Paper>

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
                <TableCell>Shareable Link</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {uploadedFiles.map((file) => (
                <TableRow key={file.filename}>
                  <TableCell>{file.originalName}</TableCell>
                  <TableCell>{file.tags.join(", ")}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => alert(`Shareable link: ${file.shareableLink}`)}
                    >
                      Share Link
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

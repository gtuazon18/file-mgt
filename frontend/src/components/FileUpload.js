import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { IoMdCloseCircle } from "react-icons/io";
import AttachFileIcon from '@mui/icons-material/AttachFile';

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [tags, setTags] = useState("");
  const [previewFiles, setPreviewFiles] = useState([]); // Store files for preview
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setPreviewFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); // Add dropped files to preview
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
    accept: "*/*",
    onDragOver: (e) => e.preventDefault(),
    onDragLeave: (e) => e.preventDefault(),
  });

  // Upload selected files
  const uploadFile = async () => {
    if (previewFiles.length === 0) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    previewFiles.forEach((file) => {
      formData.append("file", file); // Appends each file individually
    });

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
        setFileUploadSuccess(true);
        alert("File uploaded successfully!");
        fetchUploadedFiles(); // Fetch updated list of uploaded files
      } else {
        alert("File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  // Fetch uploaded files
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

  // Handle adding tags to uploaded files
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

  // Handle copying file shareable link to clipboard
  const copyLinkToClipboard = (link) => {
    const textArea = document.createElement("textarea");
    textArea.value = link;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Link copied to clipboard!");
  };

  const removePreviewFile = (index) => {
    setPreviewFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

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

      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #3f51b5",
          borderRadius: "10px",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: "#f0f0f0",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          transition: "border-color 0.3s ease",
          "&:hover": {
            borderColor: "#303f9f",
          },
          marginTop: "50px",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography variant="body1" color="primary">
            Drop the files here...
          </Typography>
        ) : (
          <>
            <UploadFileIcon sx={{ fontSize: 50, color: "#757575" }} />
            <Typography variant="body1" mt={2}>
              Drag & drop files here, or click to select
            </Typography>
          </>
        )}
      </Box>

      {previewFiles.length > 0 && !fileUploadSuccess && (
        <Box sx={{ mt: 3, width: "100%", maxWidth: 600 }}>
          {previewFiles.map((file, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AttachFileIcon sx={{ fontSize: 30, color: "#757575" }} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                {file.name}
              </Typography>
              <IconButton
                onClick={() => removePreviewFile(index)}
                sx={{ position: "absolute", top: 5, right: 5 }}
              >
                <IoMdCloseCircle />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={uploadFile}
            sx={{ mt: 3 }}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Files"}
          </Button>
        </Box>
      )}

      {/* Show LinearProgress while uploading */}
      {uploading && (
        <Box sx={{ width: "100%", mt: 3 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Display selected file details */}
      {!previewFiles.length && !fileUploadSuccess && (
        <Box mt={3} textAlign="center">
          <Typography variant="body1" gutterBottom>
            No file selected
          </Typography>
        </Box>
      )}

      {/* Display uploaded files */}
      <Typography
        variant="h5"
        mt={5}
        gutterBottom
        sx={{ textAlign: "center" }} 
      >
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
                  <TableCell>{Array.isArray(file.tags) ? file.tags.join(", ") : file.tags}</TableCell>
                  <TableCell>{file.viewCount}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => copyLinkToClipboard(file.shareable_link)}
                    >
                      Copy Link
                    </Button>
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Add Tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{ mr: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => addTags(file.original_name)}
                    >
                      Add Tags
                    </Button>
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

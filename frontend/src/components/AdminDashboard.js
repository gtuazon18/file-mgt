import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
} from "@mui/material";

const AdminDashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false); // For initial fetch

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const token = localStorage.getItem("token");
    setFetching(true);
    try {
      const res = await axios.get(process.env.REACT_APP_API_BASE_URL + "/uploads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (error) {
      alert("Error fetching files");
    } finally {
      setFetching(false);
    }
  };

  const deleteFile = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) {
      return;
    }

    const token = localStorage.getItem("token");
    setLoading((prevLoading) => ({ ...prevLoading, [filename]: true }));

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/uploads/${filename}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("File deleted successfully!");
      fetchFiles(); 
    } catch (error) {
      console.error(error.response || error);
      alert(
        error.response?.data?.message || "An error occurred while deleting the file"
      );
    } finally {
      setLoading((prevLoading) => ({ ...prevLoading, [filename]: false }));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {fetching ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table>
            <TableHead>
            <TableRow>
              <TableCell>Filename</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>View Count</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.filename}>
                  <TableCell>{file.original_name}</TableCell>
                  <TableCell>{file.tags}</TableCell>
                  <TableCell>{file.viewCount}</TableCell> 
                  <TableCell>
                  <Button
                    color="secondary"
                    onClick={() => deleteFile(file.filename)}
                    disabled={loading[file.filename]} 
                  >
                    {loading[file.filename] ? "Deleting..." : "Delete"}
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default AdminDashboard;

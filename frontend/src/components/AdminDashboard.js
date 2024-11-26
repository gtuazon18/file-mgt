import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Button, Paper, Table, TableHead, TableBody, TableCell, TableRow } from "@mui/material";

const AdminDashboard = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(process.env.REACT_APP_API_BASE_URL + "/uploads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (error) {
      alert("Error fetching files");
    }
  };

  const deleteFile = async (filename) => {
    const token = localStorage.getItem("token");

    try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/uploads/${filename}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("File deleted successfully!");
      fetchFiles();
    } catch (error) {
      alert("Error deleting file");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Filename</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.filename}>
                <TableCell>{file.original_name}</TableCell>
                <TableCell>{file.tags}</TableCell>
                <TableCell>
                  <Button color="secondary" onClick={() => deleteFile(file.filename)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;

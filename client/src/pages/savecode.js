import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  InputLabel,
  TextField,
  Typography,
  Modal,
} from "@mui/material";
import toast from "react-hot-toast";

const SaveCodeFile = ({ initialCode, openModal, setOpenModal }) => {


  const id = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    title: "Code File Title",
    language: "cpp",
    description: initialCode,
  });
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       
      const { data } = await axios.post("http://localhost:8080/api/v1/code/create-code", {
        title: inputs.title,
        language: inputs.language,
        description: inputs.description,
        user: id,
      });
      if (data?.success) {
        toast.success("Code file saved successfully");
        // navigate("/my-code-files");
        handleClose(); // Close the modal after saving
      }
      else{
        if(data.status===400) toast.success("Enter All Fields");
        if(data.status===404) toast.success("User not found , Please Register first");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal
open={openModal}
onClose={handleClose} // Call handleClose function when the modal is closed
        aria-labelledby="save-code-modal"
        aria-describedby="save-code-form"
      >
        <Box
          width={"80%"} // Increase the width of the modal
          padding={3}
          margin="auto"
          boxShadow={"0px 4px 12px rgba(0, 0, 0, 0.1)"}
          borderRadius={8}
          backgroundColor="#fff"
        >
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            color="#333"
            paddingBottom={2}
          >
            Save Code File
          </Typography>
          <form onSubmit={handleSubmit}>
            <InputLabel htmlFor="title" sx={{ fontSize: "20px", fontWeight: "bold" }}>
              Title
            </InputLabel>
            <TextField
              id="title"
              name="title"
              value={inputs.title}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              fullWidth
              required
              sx={{ marginBottom: 2 }}
            />
            <InputLabel htmlFor="language" sx={{ fontSize: "20px", fontWeight: "bold" }}>
              Language
            </InputLabel>
            <TextField
              key={openModal ? "modal-opened" : "modal-closed"}
              id="language"
              name="language"
              value={inputs.language}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              fullWidth
              required
              sx={{ marginBottom: 2 }}
            />
            <InputLabel htmlFor="description" sx={{ fontSize: "20px", fontWeight: "bold" }}>
              Code Content
            </InputLabel>
            <TextField
              id="description"
              name="description"
              value={inputs.description}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              fullWidth
              required
              multiline
              rows={10} // Increase the number of rows for code content
              sx={{ marginBottom: 2 }}
            />
            <Box display="flex" justifyContent="flex-end" sx={{ marginTop: 2 }}>
              <Button type="button" onClick={handleClose} variant="contained" color="primary" sx={{ marginRight: 2 }}>
                Close
              </Button>
              <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default SaveCodeFile;

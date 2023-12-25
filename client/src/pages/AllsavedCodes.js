// AllsavedCodes.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GrEdit } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { Modal, Box, Typography, Button } from "@mui/material";
import toast from "react-hot-toast";

import './AllsavedCodes.css'; // Import your CSS file for styling

const AllsavedCodes = () => {
  const [savedCodes, setSavedCodes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [editedCode, setEditedCode] = useState({
    _id: '',
    title: '',
    language: '',
    description: '',
  });
  const [editMode, setEditMode] = useState(false); // State to track whether the modal is in edit mode

  useEffect(() => {
    // Fetch the user's saved codes from the server when the component mounts
    const fetchSavedCodes = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const { data } = await axios.get(`http://localhost:8080/api/v1/code/user-code/${userId}`);
        setSavedCodes(data.userCode.codes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSavedCodes();
  }, []);

  // Function to delete a code by its ID
  const handleDeleteCode = async (codeId) => {
    try {
      const { data } = await axios.delete(`http://localhost:8080/api/v1/code/delete-code/${codeId}`);
      // Remove the deleted code from the savedCodes state
      setSavedCodes((prevCodes) => prevCodes.filter((code) => code._id !== codeId));
      if (data.success) {
        toast.success("Code Deleted successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to open the modal and set the selected code for editing
  const openEditModal = (codeId) => {
    const codeToEdit = savedCodes.find((code) => code._id === codeId);
    setEditedCode({
      _id: codeToEdit._id,
      title: codeToEdit.title,
      language: codeToEdit.language,
      description: codeToEdit.description,
    });
    setEditMode(true);
    setIsModalOpen(true);
  };

  // Function to open the modal in view mode
  const openViewModal = (codeId) => {
    const codeToDisplay = savedCodes.find((code) => code._id === codeId);
    setEditedCode({
      _id: codeToDisplay._id,
      title: codeToDisplay.title,
      language: codeToDisplay.language,
      description: codeToDisplay.description,
    });
    setEditMode(false);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle changes in the input fields of the modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCode((prevCode) => ({
      ...prevCode,
      [name]: value,
    }));
  };

  // Function to save the edited code
  const saveEditedCode = async () => {
    try {
      // Send a PUT or PATCH request to update the code on the server
      const { data } = await axios.put(`http://localhost:8080/api/v1/code/update-code/${editedCode._id}`, {
        title: editedCode.title,
        language: editedCode.language,
        description: editedCode.description,
      });
      // Update the code in the savedCodes state
      setSavedCodes((prevCodes) =>
        prevCodes.map((code) =>
          code._id === editedCode._id ? editedCode : code
        )
      );
      if (data.success) {
        toast.success("Code Updated successfully");
      }
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="allsaved-codes-container">
      <h2>Your All Saved Codes</h2>
      <ul className="code-list">
        {savedCodes.map((code) => (
          <li key={code._id} className="code-item">
            <div className="code-header">
              <h3>{code.title}</h3>
              <div className="code-actions">
                <button onClick={() => openEditModal(code._id)}>
                  <GrEdit className="code-icon edit-icon" />
                </button>
                <button onClick={() => handleDeleteCode(code._id)}>
                  <MdDelete className="code-icon delete-icon" />
                </button>
              </div>
            </div>
            <p className="code-language">Language: {code.language}</p>
            {/* Display the code in a modal when clicked */}
            <button className="view-code-button" onClick={() => openViewModal(code._id)}>
              View Code
            </button>
          </li>
        ))}
      </ul>
      {/* Material-UI Modal */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          width={"80%"}
          padding={3}
          margin="auto"
          boxShadow={"0px 4px 12px rgba(0, 0, 0, 0.1)"}
          borderRadius={8}
          backgroundColor="#fff"
        >
          <div className="modal-content">
            <h3>{editMode ? 'Edit Code' : 'View Code'}</h3>
            <div className="form-group">
              <label>Title:</label>
              {editMode ? (
                <input
                  type="text"
                  name="title"
                  value={editedCode.title}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{editedCode.title}</span>
              )}
            </div>
            <div className="form-group">
              <label>Language:</label>
              {editMode ? (
                <input
                  type="text"
                  name="language"
                  value={editedCode.language}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{editedCode.language}</span>
              )}
            </div>
            <div className="form-group">
              <label>Code:</label>
              {editMode ? (
                <textarea
                  name="description"
                  value={editedCode.description}
                  onChange={handleInputChange}
                />
              ) : (
                <pre>{editedCode.description}</pre>
              )}
            </div>
            {editMode && (
              <div className="modal-actions">
                <button onClick={saveEditedCode}>Update</button>
                <button onClick={closeModal}>Close</button>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AllsavedCodes;
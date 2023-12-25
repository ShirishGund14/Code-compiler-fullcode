import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import "./Form.css"; // Import the CSS file

const Register = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/user/register", {
        username: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });
      if (data.success) {
        toast.success("User Register Successfully");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="register-box"> {/* Use a div instead of Box */}
          <h4 className="register-heading">Register</h4> {/* Use h4 instead of Typography */}
          <input
            placeholder="name"
            value={inputs.name}
            onChange={handleChange}
            name="name"
            type="text"
            required
          />
          <input
            placeholder="email"
            value={inputs.email}
            name="email"
            type="email"
            required
            onChange={handleChange}
          />
          <input
            placeholder="password"
            value={inputs.password}
            name="password"
            type="password"
            required
            onChange={handleChange}
          />

          <button type="submit" className="submit-button">
           Register
          </button>
          <button onClick={() => navigate("/login")} className="login-button">
            Already Registered? Please Login
          </button>
        </div>
      </form>
    </>
  );
};

export default Register;

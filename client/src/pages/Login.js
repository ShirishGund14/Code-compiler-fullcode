import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import "./Form.css"; // Import the CSS file

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
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
      const { data } = await axios.post("/api/v1/user/login", {
        email: inputs.email,
        password: inputs.password,
      });

      console.log(data);

      if (data.success) {
        localStorage.setItem("userId", data?.user._id);
        dispatch(authActions.login());
        toast.success("User login Successfully");
        navigate("/");
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <h4>Login</h4>

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

          <button type="submit">Login</button>
          <button onClick={() => navigate("/register")}>
            Don't have an account? Register
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;

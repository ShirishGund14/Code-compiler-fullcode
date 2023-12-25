import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Code from "../Code/Code";

const Header = () => {
  const isLogin = useSelector((state) => state.isLogin);
  const dispatch = useDispatch();

  const handleLogout = () => {
    try {
      dispatch(authActions.logout());
      toast.success("Logout Successfully");
      localStorage.clear();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="header">
      <div className="buttons">
        {!isLogin ? (
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </>
        ) : (
         <>
          <button onClick={handleLogout}>Logout</button>
          <Code/>
         </>
        )}
      </div>
    </div>
  );
};

export default Header;

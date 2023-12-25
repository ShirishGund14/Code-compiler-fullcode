import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Code from "./Code/Code";
import AllsavedCodes from "./pages/AllsavedCodes";


function App() {  
  return (
    <>
     
      <Toaster />
      <Routes>
          <Route path="/" element={<Code/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/all-saved-codes" element={<AllsavedCodes />} />
      </Routes>
    </>
  );
}

export default App;

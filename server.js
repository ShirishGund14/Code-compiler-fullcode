const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path=require('path');

//env config
dotenv.config();

//router import
const userRoutes = require("./routes/userRoutes");
const codeRoutes=require('./routes/CodeRoutes');

//mongodb connection
connectDB();

//rest objecct

const {generateFile}=require('./generateFile');
const {executeCpp}=require("./executeCpp")
const {executePy}=require("./executePy")

const app = express();

//middelwares
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/code", codeRoutes);
app.use("/api/v1/blogs", codeRoutes);


app.post('/run',async(req,res)=>{
  const {language="cpp",code}=req.body;
  // console.log(language,code.length);

  if(code===undefined){
      return res.status(400).json({
          success:false,
          error:"Empty code body!"
      })
  }
  try {
  //need to generate  a c++ file with contetnt from req
  const filepath=await generateFile(language,code);

  

  //we need to run the file and send the res
  let output;
  if(language==='cpp'){
       output=await executeCpp(filepath);
  }
  else {
       output=await executePy(filepath);
  }
  
  return res.json({filepath,output});
  } catch (err) {
      res.status(500).json({err});
  }
})




//DEPLOY
// app.use(express.static(path.join(__dirname,"./client/build")));
// app.get('*',function(req,res){
//   res.sendFile(path.join(__dirname,"./client/build/index.html"));
// });


// Port
const PORT = process.env.PORT || 8080;
//listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode port no ${PORT}`.bgCyan
      .white
  );
});

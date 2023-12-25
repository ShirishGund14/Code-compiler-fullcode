const mongoose = require("mongoose");
const codeModel=require('../models/codeModel')
const userModel = require("../models/userModel");

//GET ALL BLOGS
exports.getAllCodesController = async (req, res) => {
  try {
    const codes = await codeModel.find({}).populate("user");
    if (!codes) {
      return res.status(200).send({
        success: false,
        message: "No saved codes Found",
      });
    }
    return res.status(200).send({
      success: true,
      CodeCount: codes.length,
      message: "All saved lists",
      codes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error WHile Getting codes",
      error,
    });
  }
};

//Create Blog
exports.createCodeController = async (req, res) => {
  try {
    const { title, language,description,  user } = req.body;
    //validation
    if (!title || !description || !language || !user) {
      return res.status(400).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    const exisitingUser = await userModel.findById(user);
    //validaton
    if (!exisitingUser) {
      return res.status(404).send({
        success: false,
        message: "unable to find user",
      });
    }

    const newCode= new codeModel({ title, language,description,user });
    const session = await mongoose.startSession();
    session.startTransaction();
    await newCode.save({ session });
    exisitingUser.codes.push(newCode);
    await exisitingUser.save({ session });
    await session.commitTransaction();
    await newCode.save();
    return res.status(201).send({
      success: true,
      message: "Code Saved Successfully!",
      newCode,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error WHile Creting code",
      error,
    });
  }
};

//Update Blog
exports.updateCodeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title,language, description} = req.body;
    const code = await codeModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Code Updated!",
      code,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error WHile Updating Blog",
      error,
    });
  }
};

//SIngle code
exports.getCodeByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const code = await codeModel.findById(id);
    if (!code) {
      return res.status(404).send({
        success: false,
        message: "code not found with this is",
      });
    }
    return res.status(200).send({
      success: true,
      message: "fetch single code",
      code,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "error while getting single code",
      error,
    });
  }
};

//Delete code
exports.deleteCodeController = async (req, res) => {
  try {
    const code = await codeModel
      // .findOneAndDelete(req.params.id)
      .findByIdAndDelete(req.params.id)
      .populate("user");
    await code.user.codes.pull(code);
    await code.user.save();
    return res.status(200).send({
      success: true,
      message: "code Deleted!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Erorr WHile Deleteing Code",
      error,
    });
  }
};

//GET USER code
exports.userCodeController = async (req, res) => {
  try {
    const userCode = await userModel.findById(req.params.id).populate("codes");

    if (!userCode) {
      return res.status(404).send({
        success: false,
        message: "codes not found with this id",
      });
    }
    return res.status(200).send({
      success: true,
      message: "user saved codes",
      userCode,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "error in user code",
      error,
    });
  }
};

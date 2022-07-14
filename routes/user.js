const Ajv = require("ajv").default;
const ajv = new Ajv({ allErrors: true });
// Ajv option allErrors is required
require("ajv-errors")(ajv /*, {singleError: true} */);

const userSchema = require("../schema/user");
const userModel = require("../model/user");

const getUserSchema = userSchema.getAllUserSchema;
const getListuserModel = userModel.getAllUsers;

const getInforUserSchema = userSchema.showInforUerSchema;
const getInforUserModel = userModel.showInforUser;

const addUserSchema = userSchema.addUserSchema;
const addNewUserModel = userModel.add;

const editUserSchema = userSchema.editUserSchema;
const editUserModel = userModel.editUser.getUserHandler;

const getIdDestroyUserSchema = userSchema.deleteUserSchema.params;
const destroyUserModel = userModel.delete.deleteUserHandler;



module.exports = async function (fastify, opts) {

  //Api list users
  fastify.get("/user", getUserSchema, getListuserModel);

  // Api get infor user
  fastify.get("/user/:id", getInforUserSchema , getInforUserModel);

  // Api add new user
  fastify.post("/user/add", addUserSchema, addNewUserModel);

  // Api edit for user
  fastify.put("/user/edit/:id", editUserSchema , editUserModel);

  // Api delete for user
  fastify.delete("/user/delete/:id", getIdDestroyUserSchema, destroyUserModel);
};

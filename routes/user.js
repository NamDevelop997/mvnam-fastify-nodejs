const Ajv = require("ajv").default;
const ajv = new Ajv({ allErrors: true });
// Ajv option allErrors is required
require("ajv-errors")(ajv /*, {singleError: true} */);

const userSchema = require("../schema/user");
const userModel = require("../model/user");

const listUsers = userSchema.getAllUserSchema;
const getListuserModel = userModel.getAllUsers;

const inforUser = userSchema.showInforUerSchema;
const getInforUserModel = userModel.showInforUser;

const addUser = userSchema.addUserSchema;
const addNewUserModel = userModel.add;

const editUser= userSchema.editUserSchema;
const editUserModel = userModel.editUser;

const delUser = userSchema.deleteUserSchema;
const destroyUserModel = userModel.delete;



module.exports = async function (fastify, opts) {

  //Api list users
  fastify.get("/user/", {schema: listUsers}, getListuserModel);

  // Api get infor user
  fastify.get("/user/:id", {schema : inforUser}, getInforUserModel);

  // Api add new user
  fastify.post("/user/add", {schema: addUser}, addNewUserModel);

  // Api edit for user
  fastify.put("/user/edit/:id", {schema: editUser} , editUserModel);

  // Api delete for user
  fastify.delete("/user/delete/:id", {schema: delUser}, destroyUserModel);
};

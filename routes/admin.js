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

const editUserPassword = userSchema.editPassword;
const editUserPassWordModel = userModel.updatePassword;

const delUser = userSchema.deleteUserSchema;
const destroyUserModel = userModel.delete;

// const tokenSchema = userSchema.tokenSchema;
// const verifyGmail = userModel.verifyGmail;



module.exports = async function (fastify, opts) {

  //Api list users
  fastify.get("/user/", {schema: listUsers, preHandler: fastify.checkRoleUser1 }, getListuserModel);

  // Api get infor user
  fastify.get("/user/:id", {schema : inforUser,preHandler: fastify.checkRoleUser1  }, getInforUserModel);

  // Api add new user
  fastify.post("/user/add", {schema: addUser, preHandler: fastify.checkRoleUser1 }, addNewUserModel);

  // Api edit for user
  fastify.put("/user/edit/:id", {schema: editUser, preHandler: fastify.checkRoleUser1 } , editUserModel);

  //Api update password
  fastify.put("/user/edit_password/:id", {schema: editUserPassword, } , editUserPassWordModel);

  // Api delete for user
  fastify.delete("/user/delete/:id", {schema: delUser, preHandler: fastify.checkRoleUser1 }, destroyUserModel);

  //Verify email 
  // fastify.delete("/user/verify/:token", {schema: tokenSchema}, verifyGmail);
};

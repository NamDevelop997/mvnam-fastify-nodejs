


const userSchema = require ('../schema/user')
const userModel = require ('../model/user')

const getUserSchema = userSchema.getAllUserSchema.schema;
const getListuserModel = userModel.getAllUsers.getAll;

const getIdUserSchema  = userSchema.showInforUerSchema.params;
const getInforUserModel  = userModel.showInforUser.getUserHandler;

const addUserSchema  = userSchema.addUserSchema;
const addNewUserModel  = userModel.add.addNewUser;

const getIdEditUserSchema  = userSchema.editUserSchema.params;
const editUserModel  = userModel.editUser.getUserHandler;

const getIdDestroyUserSchema  = userSchema.deleteUserSchema.params;
const destroyUserModel  = userModel.delete.deleteUserHandler;


module.exports = async function (fastify, opts) {
 
  //Api list users
  fastify.get("/user",  getUserSchema, getListuserModel);

  // Api get infor user
  fastify.get("/user/:id",  getIdUserSchema,  getInforUserModel);
  
  // Api add new user
  fastify.post("/user/add",  addUserSchema,  addNewUserModel);

  
  // Api edit for user
  fastify.put("/user/edit/:id",  getIdEditUserSchema, editUserModel);
  
  // Api delete for user
  fastify.delete("/user/delete/:id",  getIdDestroyUserSchema, destroyUserModel);


 
};

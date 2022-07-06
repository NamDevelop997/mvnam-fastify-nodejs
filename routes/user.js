
const userSchema = require ('../schema/user')
const getSchema = userSchema.getAllUsers.schema;
const getAllUsers = userSchema.getAllUsers.getAll;
const getIdUser  = userSchema.showInforUer.params;
const getInforUser  = userSchema.showInforUer.getUserHandler;

module.exports = async function (fastify, opts) {
 
  //api list user
  fastify.get("/user",  getSchema, getAllUsers);

  fastify.get("/user/:id",  getIdUser, getInforUser);



};

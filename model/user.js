
const bcrypt = require("bcrypt");
const log = require("fastify-cli/log");

const optionDatabase = require("../config");
const knex = require("knex")(optionDatabase.database);
const paramsHelper = require("./../helpers/getParams")

module.exports = {
  // Api get all users
  getAllUsers: async (req, reply) => {
    console.log(parseInt(req.query.page));
    
    var reqData = req.query;
    console.log(reqData);
    
    var pagination = {};
    var per_page = parseInt(reqData.page) || 1;
    var page = parseInt(reqData.current_page) || 1;
    if (page < 1) page = 1;
    var offset = (page - 1) * per_page;
   
     
    let totalItemPerPage = 2;

    let data = [];
    await knex
      .from("user")
      .select(["id", "fullname", "gmail", "level"])
      .limit (totalItemPerPage)
      .offset (offset)
      .then((user) => {
        data = user;
        listUser = user;
      });

    reply.send({ success: true, data });


  },

  // Api get infor user
  showInforUser: async (req, reply) => {
    const { id } = req.params;
    let data = [];
    let inforUser;

    await knex
      .from("user")
      .select("*")
      .then((user) => {
        data = user;
      });

    if (id && data.length > 0) {
      await knex("user")
        .select(["id", "fullname", "gmail", "level"])
        .where("id", "=", id)
        .then((data) => {
          inforUser = data;
        });
    } else {
      return reply.status(404).send(new Error("User not found"));
    }
    if (Array.isArray(inforUser) && !inforUser.length) {
      return reply.status(404).send(new Error("User not found"));
    }
    reply.send({ success: true, data: inforUser });
  },

  // Api add user
  add: async (req, reply) => {
    let { fullname, gmail, password, level } = req.body;
    // hash password
    password = await bcrypt.hash(password, 9);

    // check type gmail (@gmail, @yahoo, @lookout ...)
    let pattern = /([a-zA-Z0-9_.-]+)@([a-zA-Z]+)([\.])([a-zA-Z]+)/i;
    let checkMail = pattern.test(gmail);

    let checkAccountInDB = await knex("user")
      .select("gmail")
      .where("gmail", gmail);
    if (checkMail) {
      if (checkAccountInDB.length > 0) {
        reply.send({ success: false, message: "account is already in use" });
      } else {
        await knex("user")
          .insert({ fullname, gmail, password, level })
          .then(() => {
            reply.send({
              success: true,
              message: " Account created successfully",
            });
          });
      }
    } else {
      reply.send({
        success: false,
        message: `Email is not in the correct format! (ex: @email, @yahoo, @outlook...)`,
      });
    }
  },

  // Api edit infor user
  editUser: async (req, reply) => {
    let dataUpdate = req.body;
    let { id } = req.params;
    let inforUser;

    //Check Id user
    if (id) {
      await knex("user")
        .select(["fullname", "gmail", "level"])
        .where("id", "=", id)
        .then((data) => {
          inforUser = data;
        });
    } else {
      return reply.status(404).send(new Error(`User id = ${id} not found`));
    }
    // End check id

    // Check inforUser and inforUser is null
    if (Array.isArray(inforUser) && !inforUser.length) {
      return reply.status(404).send(new Error(`User id = ${id} not found`));
    }

    // Update user with id
    if (id != undefined && dataUpdate !== undefined) {
      //Check gmail Type
      let pattern = /([a-zA-Z0-9_.-]+)@([a-zA-Z]+)([\.])([a-zA-Z]+)/i;
      let checkMail = pattern.test(dataUpdate.gmail);
      if (!checkMail) {
        reply.send({
          success: false,
          msg: `Email is not in the correct format! (ex: @email, @yahoo, @outlook...)`,
        });
      } else {
        await knex("user")
          .where("id", "=", id)
          .update(dataUpdate)
          .then(() => {
            return reply.send({
              success: true,
              msg: `update user id = ${id} success`,
            });
          });
      }
      // End check Gmail type
    } else {
      return reply.status(404).send(new Error(`User id = ${id} not found`));
    }
  },

  delete: async (req, reply) => {
    let { id } = req.params;

    let inforUser;

    //Check id doesnt exist in database
    if (id) {
      await knex("user")
        .select(["fullname", "gmail", "level"])
        .where("id", "=", id)
        .then((data) => {
          inforUser = data;
        });
    } else {
      return reply.status(404).send(new Error(`User id = ${id} not found`));
    }
    if (Array.isArray(inforUser) && !inforUser.length) {
      return reply.status(404).send(new Error(`User id = ${id} not found`));
    }

    // Delete user
    await knex("user")
      .delete()
      .where("id", "=", id)
      .then(() => {
        return reply.send({ success: "dsa", msg: "delete successfully!" });
      });
  },
};

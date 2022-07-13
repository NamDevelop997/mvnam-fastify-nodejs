const optionDatabase = require("../config");
const knex = require("knex")(optionDatabase.database);
const bcrypt = require("bcrypt");
const log = require("fastify-cli/log");

module.exports = {
  // Api get all users
  getAllUsers: async (req, reply) => {
    let data = [];
    await knex
      .from("user")
      .select(["id", "fullname", "gmail", "level"])
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

    // check gmail @gmail, @yahoo, @lookout ...
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
          .insert(req.body)
          .then(() => {
            reply.send({
              success: true,
              message: " Account created successfully",
            });
          });
      }
    }else{
      reply.send({ success: false, message: `Email is not in the correct format! (ex: @email, @yahoo, @outlook...)` });

    }
  },

  // Api edit infor user
  editUser: {
    getUserHandler: async (req, reply) => {
      let dataUpdate = req.body;

      if (dataUpdate.password) {
        req.body.password = await bcrypt.hash(dataUpdate.password, 9);
      }
      
      let { id } = req.params;
      // Check id doesn't exist in database
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
          .select("*")
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

      // update user with id
      if (id != undefined && dataUpdate !== undefined) {
        await knex("user")
          .where("id", "=", id)
          .update(dataUpdate)
          .then(() => {
            return reply
              .send({ success: true, msg: `update user id = ${id} success` });
          });
      } else {
        return reply.status(404).send(new Error(`User id = ${id} not found`));
      }

      reply.send({ success: true, msg: `update user with id = ${id} success` });
    },
  },

  delete: {
    deleteUserHandler: async (req, reply) => {
      let { id } = req.params;
      //Check id doesnt exist in database
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
          .select("*")
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
          return reply
            .status(200)
            .send({ success: true, msg: "delete successfully!" });
        });
    },
  },
};

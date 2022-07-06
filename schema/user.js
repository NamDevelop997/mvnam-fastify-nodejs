const optionDatabase = require("./../config");

const knex = require("knex")(optionDatabase.database);
const getAllUsers = {
  schema: {
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            fullname: { type: "string" },
            gmail: { type: "string" },
            address: { type: "string" },
            phone: { type: "string" },
            level: { type: "string" },
            password: { type: "string" },
          },
        },
      },
    },
  },
  getAll: async (req, reply) => {
    let data = [];
    await knex
      .from("user")
      .select("*")
      .then((user) => {
        data = user;
        listUser = user;
      });

    reply.send({ msg: data });
  },
};

const showInforUer = {
  params: {
    id: { type: "string" },
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "string" },
        body: { type: "string" },
      },
    },
  },
  getUserHandler: async (req, reply) => {
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
        .select("*")
        .where("id", "=", id)
        .then((data) => {
          inforUser = data;
        });
    } else {
      return reply.send({
        errorMsg: "User not found",
      });
    }
    reply.send({ infor: inforUser });
  },
};

module.exports = { getAllUsers, showInforUer };

"use strict";

const path = require("path");
const AutoLoad = require("@fastify/autoload");

const optionDatabase = require("./config");
const testSChe = require("./schema/user");


const knex = require("knex")(optionDatabase.database);

const secretKey = require("./secretKey");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { log } = require("console");


module.exports = async function (fastify, opts) {
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });

  // Login
  fastify.post("/api/login", async (req, reply) => {
    let { email, password } = req.body;

    try {
      if (!email || !password) {
        reply.send({
          success: false,
          msg: "Please fill the field",
        });
      } else {
        let user = [];
        await knex
          .from("user")
          .select(["id", "fullname", "gmail", "level", "password"])
          .where("gmail", "=", email)
          .then((data) => {
            user = data;
          });
        console.log(user);

        if (user.length == 1) {
          let hashPassword = await bcrypt.compare(password, user[0].password);
          if (hashPassword) {
            const payload = { id: user.id };
            const token = jwt.sign({ payload }, secretKey.keySecret);
            reply.send({
              success: true,
              msg: "Login Successfully",
              token: token,
            });
          } else {
            reply.send({
              success: false,
              msg: "InValid password",
            });
          }
        } else {
          reply.send({
            success: false,
            msg: "InValid Email and password",
          });
        }
      }
    } catch (error) {
      reply.send({ err: error });
    }
  });

  fastify.register(require("./routes/user"), { prefix: "/admin/api" });
};

"use strict";

const path = require("path");
const AutoLoad = require("@fastify/autoload");

const optionDatabase = require("./config");
const knex = require("knex")(optionDatabase.database);
const secretKey = require("./secretKey");
const bcrypt = require("bcrypt");

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

  fastify.post("/signup", async (req, reply) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        reply.send({
          success: false,
          msg: "Please fill the field",
        });
      } else {
        let user = await knex
          .from("user")
          .select(["id", "fullname", "gmail", "level", "password"])
          .where("gmail", "=", email);

        console.log(user);

        if (user) {
          // password = bcrypt.hash(password,12)
          console.log("password ----", 34);

          const hashPassword = await bcrypt.compare(password, user.password);
          if (hashPassword) {
            const payload = { id: user.id };
            const token = jwt.sign({ payload }, secretKey);
            reply.send({
              success: true,
              msg: "Login Successfully",
              token: token,
            });
          } else {
            reply.send({
              success: false,
              msg: "InValid Email and password",
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

    //  const token = fastify.jwt.sign({ "gmail": "tst@gmail.com123", "password": "df34e sd3"})
    //  reply.send({ token })
  });
  fastify.register(require("./routes/user"), { prefix: "/admin/api" });
};

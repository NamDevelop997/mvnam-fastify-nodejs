"use strict";

const path = require("path");
const AutoLoad = require("@fastify/autoload");
const nodemailer = require("nodemailer");

const optionDatabase = require("./config");
const knex = require("knex")(optionDatabase.database);

const secretKey = require("./secretKey");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { log } = require("console");
const paramsHelper = require("./helpers/getParams");

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

  fastify.get("/verify_gmail", {schema: { params : {token :{type: "string"}}}}, async (req, reply) => {
    let token = paramsHelper(req.query, "token", "");
    let dataUser = [];
    let update = { token: null, status: 'active'}

    // Find user have token on params
    await knex('user')
      .select('id','fullname', "gmail", "level", "status")
      .where("token",token)
      .then( (data)=>{
        dataUser = data;
      })

    if(dataUser.length > 0) {
      // Update status for user  
        await knex('user')
        .where("id", dataUser[0].id)
        .update(update )
        .then(() => {
          return reply.send({
            success: true,
            msg: `update user id = ${dataUser[0].id} success`,
          });
        });

    }
    
      reply.send({dataUser});
    
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
        await knex("user")
          .select(["id", "fullname", "gmail", "level", "password"])
          .where("gmail", "=", email)
          .then((data) => {
            user = data;
          });

    
          
        if (user.length == 1) {
          let hashPassword = await bcrypt.compare(password, user[0].password);
          if (hashPassword) {
            const payload = { id: user[0].id , level: user[0].level};
          
            const token = jwt.sign(payload , secretKey.keySecret);
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

  fastify.register(require("./routes/admin"), { prefix: "/admin/api" });
};

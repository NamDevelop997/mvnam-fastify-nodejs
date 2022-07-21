const bcrypt = require("bcrypt");
const log = require("fastify-cli/log");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const optionDatabase = require("../config");
const knex = require("knex")(optionDatabase.database);
const paramsHelper = require("./../helpers/getParams");
const secretKey = require("../config");
const { default: fastify } = require("fastify");

module.exports = {
  // Api get all users
  getAllUsers: async (req, reply) => {
    let objwhere = {};
    let data = [];
    let getPageOnURL = paramsHelper(req.query, "page", 1);
    let getFullName = paramsHelper(req.query, "fullname", "");
    let getGmail = paramsHelper(req.query, "gmail", "");
    let getLevel = paramsHelper(req.query, "level", "");
    let getStatus = paramsHelper(req.query, "status", "");

    if (getFullName !== "") {
      objwhere.fullname = getFullName;
    }
    if (getGmail !== "") {
      objwhere.gmail = getGmail;
    }

    if (getLevel !== "") {
      objwhere.level = getLevel;
    }

    if (getStatus !== "") {
      objwhere.status = getStatus;
    }

    if (getPageOnURL === "" || getPageOnURL < 1) getPageOnURL = 1;

    let totalItems = 1;
    await knex("user")
      .select("fullname")
      .then((data) => {
        totalItems = data.length;
      });
    let showItemPerpage = 15;
    let currentPage = getPageOnURL;

    await knex("user")
      .select(["id", "fullname", "gmail", "level", "status"])
      .limit(showItemPerpage)
      .offset((currentPage - 1) * showItemPerpage)
      .where(objwhere)
      .then((users) => {
        data = users;
        totalItems = users.length;

      });

    let totalPages = Math.ceil(totalItems / showItemPerpage);
    let  to        = showItemPerpage * currentPage ;
    let  from      = to - showItemPerpage +  1;
    if (to > totalItems) to = totalItems;
    console.log({to, from});
    
    // Check data response
    if (data.length == 0)
      reply.status(404).send({ success: false, message: "Not found!" });

    reply.send({
      success: true,
      totalPages,
      totalItems,
      showItemPerpage,
      currentPage,
      to,
      from,
      data,
    });
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
        .select(["id", "fullname", "gmail", "level", "status"])
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
    try {
      let { fullname, gmail, password, level } = req.body;
      let is_gmail;

      let pattern = /([a-zA-Z0-9_.-]+)@([a-zA-Z]+)([\.])([a-zA-Z]+)/i;
      let checkMail = pattern.test(gmail);

      if (checkMail) {
        is_gmail = await knex("user").select("gmail").where("gmail", gmail);

        if (Array.isArray(is_gmail) && is_gmail.length >= 1) {
          reply.send({
            success: false,
            message: "Email already exist",
          });
        } else {
          // Token = fullname + secretKey
          let createToken = jwt.sign({ fullname }, secretKey.secretKeyToken);
          let hashPassword = await bcrypt.hash(password, 9);
          let dataUser = {
            fullname: fullname,
            gmail: gmail,
            password: hashPassword,
            level: level,
            status: "inactive",
            token: createToken,
          };
          //Insert to database
          await knex("user")
            .insert(dataUser)
            .then(() => {
              let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "namyoutubi997@gmail.com",
                  pass: "owondfzbhibxoqmf",
                },
              });

              let mailOptions = {
                to: req.body.gmail,
                subject: "VERIFY EMAIL",
                html: `<h1>Hi ${fullname}!</h1>
                        <p>Thank you for subscribing website my us.</p>
                        <p>Please press confirm your account</p>
                        <a href="http://127.0.0.1:3000/verify_gmail?token=${createToken}">CLICK VERIFY YOUR EMAIL! </a>`,
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  reply.send({ error });
                }
              });
              reply.send({ success: true, message: "Add user successfully!" });
            });
        }
      } else {
        reply.send({
          success: false,
          message: "Gmail format(Ex: @gmail, @yahoo, @outlook...)",
        });
      }
    } catch (error) {
      reply.send("error " + error.message);
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
        .select(["fullname"])
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

  updatePassword: async (req, reply) => {
    let { password_old, password_new, password_confirm } = req.body;

    let { id } = req.params;
    let dataPassword;

    //Check Id in DB
    if (id) {
      await knex("user")
        .select(["password"])
        .where("id", "=", id)
        .then((data) => {
          dataPassword = data;
        });
    } else {
      return reply.status(404).send(new Error(`User id = ${id} not found`));
    }

    if (id !== undefined && req.body !== undefined && dataPassword.length > 0) {
      //Check password
      let hashPassword = await bcrypt.compare(
        password_old,
        dataPassword[0].password
      );

      if (hashPassword) {
        if (password_new === password_confirm) {
          //Hash password changed
          password_new = await bcrypt.hash(password_confirm, 9);
          let dataPasswordUpdate = { password: password_new };

          //Update password
          await knex("user")
            .where("id", "=", id)
            .update(dataPasswordUpdate)
            .then(() => {
              return reply.send({
                success: true,
                message: `Update password for id = ${id} success`,
              });
            });
        } else {
          reply.send({
            success: false,
            message: "wrong confirmation password!",
          });
        }
      } else {
        reply.send({ success: false, message: "Wrong old password!" });
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

const bcrypt = require("bcrypt");
const log = require("fastify-cli/log");

const optionDatabase = require("../config");
const knex = require("knex")(optionDatabase.database);
const paramsHelper = require("./../helpers/getParams");

module.exports = {
  // Api get all users
  getAllUsers: async (req, reply) => {
    let data = [];
    let getPageOnURL = paramsHelper(req.query, "page", 1);
    let getFullName = paramsHelper(req.query, "fullname", "");
    let getGmail = paramsHelper(req.query, "gmail", "");

    if (getPageOnURL === "" || getPageOnURL < 1) getPageOnURL = 1;

    let panigations = {
      totalItemsPerpage: 15,
      currentPage: getPageOnURL,
      pageRanges: 5,
    };

    await knex("user")
      .select(["id", "fullname", "gmail", "level", "status"])
      .limit(panigations.totalItemsPerpage)
      .offset((panigations.currentPage - 1) * panigations.totalItemsPerpage)
      .where("fullname", "like", `%${getFullName}%`)
      .where("gmail", "like", `%${getGmail}%`)
      .then((user) => {
        data = user;
      });

    // Check data response
    if (data.length == 0)
      reply.status(404).send({ success: false, message: "Not found!" });

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
      let { fullname, gmail, password, level, status } = req.body;
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
          let hashPassword = await bcrypt.hash(password, 9);
          let dataUser = {
            fullname: fullname,
            gmail: gmail,
            password: hashPassword,
            level: level,
            status: "inactive",
          };
          await knex("user")
            .insert(dataUser)
            .then(() => {
              reply.send({ success: true, message: "Add user successfully!" });
            });
        }
      } else {
        reply.send({
          success: false,
          message: "Non-gmail format(Ex: @gmail, @yahoo, @outlook...)",
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
                message: `update password for id = ${id} success`,
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

const optionDatabase = require("../config");
const knex = require("knex")(optionDatabase.database);
const bcrypt = require("bcrypt");

module.exports = {
  // Api get all users
  getAllUsers: {
    getAll: async (req, reply) => {
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
  },

  // Api get infor user
  showInforUser: {
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
  },

  // Api add user
  add: {
    addNewUser: async(req, res) => {
       let dataUser = req.body;
       dataUser.password = await bcrypt.hash(dataUser.password, 9);
       
     await knex("user").insert(dataUser).then( () =>{
        res.status(200).send({success : true, data: dataUser});
      });
    },
  },

  // Api edit infor user
  editUser: {
    getUserHandler: async (req, reply) => {
      req.body.password =  bcrypt.hash(dataUpdate.password,9)
      let { id } = req.params;
      let dataUpdate = req.body;
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
      if ( id != undefined && dataUpdate !== undefined) {
        await knex("user")
          .where("id", "=", id)
          .update(dataUpdate)
          .then(() => {
             return reply.status(200).send({ msg: `update user id = ${id} success`});
          })

      } else {
        return reply.status(404).send(new Error(`User id = ${id} not found`));
      }

      reply.send({ msg: `update user with id = ${id} success`});

    },
  },

  delete : {
    deleteUserHandler : async (req, reply) => {
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
        return reply.status(200).send ({msg: "delete successfully!"});
      })
    },
  }
};

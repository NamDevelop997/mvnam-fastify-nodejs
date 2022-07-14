
const optionDatabase = require("../config");
const knex = require("knex")(optionDatabase.database);


module.exports = {
    checkFormMail : function (req, reply, next)  {
        let { fullname, gmail } = req.body;
  
        // check type gmail @gmail, @yahoo, @lookout ...
        let pattern = /([a-zA-Z0-9_.-]+)@([a-zA-Z]+)([\.])([com]+)/i;
        let checkMail =  pattern.test(gmail);

        let checkAccountInDB =  knex("user")
          .select("gmail")
          .where("gmail", gmail);
        if (checkMail) {
          if (checkAccountInDB.length > 0) {
            reply.send({
              success: false,
              message: "account is already in use",
            });
          }
        } else {
          reply.send({
            success: false,
            message: `Email is not in the correct format! (ex: @email, @yahoo, @outlook...)`,
          });
        }
        next();
      },

     
}
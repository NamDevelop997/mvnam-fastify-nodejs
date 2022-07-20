"use strict";

const fp = require("fastify-plugin");
const jwt = require("jsonwebtoken");

const optionDatabase = require("../config");
const knex = require("knex")(optionDatabase.database);
const secretKey = require("./../secretKey");

module.exports = fp(async function (fastify, opts, done) {
  fastify.decorate("someSupport", function () {
    return "hugs";
  });

  fastify.decorate("checkRoleUser1", (req, reply, next) => {
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
      reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    // 'Beaer [token]'
    const token = authorizationHeader.split(" ")[1];

    jwt.verify(token, secretKey.keySecret, (err, data) => {
      // console.log(err, data);
      if (err)
        reply.status(403).send({ success: false, message: "403 Forbidden" });
      if (data.level === "leader") {
        next();
      } else {
        reply.status(403).send({ success: false, message: "403 Forbidden" });
      }
    });
  });
  done();
});

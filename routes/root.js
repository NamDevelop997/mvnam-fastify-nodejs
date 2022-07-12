'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    reply.send('Hello World!');
  }),

  fastify.get(
    "/protected",
    {
        onRequest: [fastify.authenticate]
    },
    async function (request, reply) {
       reply.send({msg: "admin authentization"});
    }
)
}



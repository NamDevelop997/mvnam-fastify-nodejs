const fp = require('fastify-plugin');
const configuration = require('./../config')
const secretKey = require('./../secretKey')

module.exports = fp(function (fastify, opts, done) {

    fastify.register(require('@fastify/jwt'), {
        secret: configuration.secretKey(secretKey.keySecret)
    })

    fastify.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })

    fastify.decorate("checkRoleUser", async function (request, reply, next) {
       console.log(`12`);
       next();
    })
    done()
    
})
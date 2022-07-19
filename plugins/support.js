'use strict'

const fp = require('fastify-plugin')
const nodemailer = require('nodemailer');


// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(async function (fastify, opts, done) {
  fastify.decorate('someSupport', function () {
    return 'hugs'
  });

  fastify.decorate('sendMail', ( req, reply, next)=>{
  
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'namyoutubi997@gmail.com',
        pass: 'owondfzbhibxoqmf'
      }
    });
    
    var mailOptions = {
      to: req.body.gmail,
      subject: 'VERIFY EMAIL',
      html: `<h1>Hi ${req.body.fullname}!</h1>
              <p>Thank you for subscribing website my us.</p>
              <p>Please press confirm your account</p>
              <a href="http://127.0.0.1:3000/admin/api/user/">CLICK VERIFY YOUR EMAIL! </a>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        reply.send({error});
      } else {
        next();
      }
    });
    next();
  })

  
  done();
})

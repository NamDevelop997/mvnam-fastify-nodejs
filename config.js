
 
module.exports = {
    name: 'rest-api',
    hostname : 'http://127.0.0.1:3000',
    version: '0.0.1',
    // env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    database : {
        client: 'mysql',
        connection: {
          host : 'localhost',
          port : 3306,
          user : 'root',
          password : '123456',
          database : 'hotel_manager',
        },
    },

    secretKey :  (keyname) => {
      
      if (!keyname) {
          throw new Error(`Configuration must include ${keyname}`)
      }
  
      return keyname;
  }
}
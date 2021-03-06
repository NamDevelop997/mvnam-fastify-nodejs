module.exports = {
  getAllUserSchema: {
    querystring: {
      type      : "object",
      properties: {
        fullname: {
          type      : "string",
          maxLength : 50,
          minLength : 1,
        },
        status: {
          type      : "string",
          maxLength : 20,
          minLength : 4,
        },
        level: {
          type      : "string",
          maxLength : 20,
          minLength : 4,
        },
        gmail: {
          type      : "string",
          format    : "email",
        },
      },
    },
    response: {
      200: {
        type       : "object",
        properties : 
        {
          success         : { type: "boolean" },
          totalPages      : { type: "number" },
          totalItems      : { type: "number" },
          totalItemsPerpage : { type: "number" },
          currentPage     : { type: "number" },
          from            : { type: "number" },
          to              : { type: "number" },
          data            : { type: "array" },
        },
      },
    },
  },

  showInforUerSchema: {
    params: {
      id  : { type: "number" },
    },
    response: {
      200   : {
        type      : "object",
        properties: {
          success : { type: "boolean" },
          data    : { type: "array" },
        },
      },
    },
  },

  addUserSchema: {
    body: {
      type    : "object",
      required: ["fullname", "gmail", "password", "level"],
      properties: {
        fullname: { type: "string", maxLength: 50, minLength: 5 }, // recall we created typeString earlier
        gmail   : {
          type  : "string",
          maxLength: 50,
          minLength: 12,
          format   : "email"
        },
        password   : { type: "string", maxLength: 15, minLength: 6 },
        level      : { type: "string", maxLength: 15, minLength: 3 },
      },
    },
    response: {
      200: {
        type       : "object",
        properties : {
          success  : { type: "boolean" },
          message  : { type: "string" },
        }, // sending a simple message as string
      },
    },
  },

  editUserSchema: {
    body: {
      type      : "object",
      required  : ["fullname", "gmail", "level"],
      properties: {
        fullname  : { type: "string", maxLength: 50, minLength: 5 }, // recall we created typeString earlier
        gmail     : { type: "string", maxLength: 50, minLength: 12, format: "email" }, // recall we created typeString earlier
        level     : { type: "string", maxLength: 15, minLength: 3 },
        status    : { type: "string", maxLength: 15, minLength: 6 },
      },
    },
    params  : {
        id  : { type: "number" }, // converts the id param to number
    },
    response: {
      200: {
        // sending a simple message as string
        type      : "object",
        properties: {
        success   : { type: "boolean" },
        msg       : { type: "string" },
        },
      },
    },
  },

  editPassword: {
    body: {
      type        : "object",
      required    : ["password_old", "password_new", "password_confirm"],
      properties  : {
        password_old    : { type: "string", maxLength: 15, minLength: 6 },
        password_new    : { type: "string", maxLength: 15, minLength: 6 },
        password_confirm: { type: "string", maxLength: 15, minLength: 6 },
      },
    },
    params  : {
      id    : { type: "number" }, // converts the id param to number
    },
    response: {
      200   : {
        // sending a simple message as string
        type      : "object",
        properties: {
          success   : { type: "boolean" },
          message   : { type: "string" },
        },
      },
    },
  },

  deleteUserSchema: {
    params: {
      id  : { type: "number" }, // converts the id param to number
    },
    response: {
      200   : {
        type      : "object",
        properties: {
          success : { type: "boolean" },
          msg     : { type: "string" },
        },
      },
    },
  },

  forgotPassword: {
    body: {
      type      : "object",
      required  : ["gmail"],
      properties: {
        gmail   : { type: "string", maxLength: 50, minLength: 12 },
        response: {
          200   : {
            // sending a simple message as string
            type: "object",
            properties: {
              success : { type: "boolean" },
              message : { type: "string" },
            },
          },
        },
      },
    },
  },
};

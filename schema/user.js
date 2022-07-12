module.exports = {
  getAllUserSchema: {
    schema: {
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              fullname: { type: "string" , errorMessage: {
                type: 'Bad  full name name'
              }},
              gmail: { type: "string" },
              password: { type: "string" },
              level: { type: "string" },
            },
          },
        },
      },
    },
  },

  showInforUerSchema: {
    params: {
      id: { type: "number" },
    },
    response: {
      200: {
        type: "object",
        properties: {
          id: { type: "number" },
          body: { type: "string" },
        },
      },
    },
  },

  addUserSchema: {
    shema: {
      body: {
        type: "array",
        required: ["fullname", "gmail", "password", "level"],
        properties: {
          fullname: { type: "string" }, // recall we created typeString earlier
          gmail: { type: "string" },
          password: { type: "string" },
          level: { type: "string" },
        },
      },
      response: {
        200: { type: "array" }, // sending a simple message as string
      },
    },
  },

  editUserSchema: {
    body: {
      type: "object",
      required: ["fullname", "gmail", "password", "level"],
      properties: {
        fullname: { type: "string" }, // recall we created typeString earlier
        gmail: { type: "string" },

        password: { type: "string" },
        level: { type: "string" },
      },
    },
    params: {
      id: { type: "number" }, // converts the id param to number
    },
    response: {
      200: {
        // sending a simple message as string
        type: "string",
        properties: {
          msg: { type: "string" },
        },
      },
    },
  },

  deleteUserSchema: {
    params: {
      id: { type: "number" }, // converts the id param to number
    },
    response: {
      200: { type: "String" },
    },
  },
};

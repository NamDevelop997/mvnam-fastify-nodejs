module.exports = {
  getAllUserSchema: {
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: { type: "array" },
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
          success: { type: "boolean" },
          data: { type: "array" },
        },
      },
    },
  },

  addUserSchema: {
    body: {
      type: "object",
      required: ["fullname", "gmail", "password", "level"],
      properties: {
        fullname: { type: "string", maxLength: 50, minLength: 5 }, // recall we created typeString earlier
        gmail: { type: "string", maxLength: 50, minLength: 12 },
        password: { type: "string", maxLength: 15, minLength: 6 },
        level: { type: "string", maxLength: 15, minLength: 3 },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        }, // sending a simple message as string
      },
    },
  },

  editUserSchema: {
    body: {
      type: "object",
      required: ["fullname", "gmail", "level"],
      properties: {
        fullname: { type: "string", maxLength: 50, minLength: 5 }, // recall we created typeString earlier
        gmail: { type: "string", maxLength: 50, minLength: 12 },
        level: { type: "string", maxLength: 15, minLength: 3 },
      },
    },
    params: {
      id: { type: "number" }, // converts the id param to number
    },
    response: {
      200: {
        // sending a simple message as string
        type: "object",
        properties: {
          success: { type: "boolean" },
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
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          msg: { type: "string" },
        },
      },
    },
  },
};

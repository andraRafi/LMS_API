import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LMS API",
      version: "1.0.0",
      description: "API documentation for LMS backend",
    },
    components: {
      schemas: {
        Register: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "johndoe@example.com" },
            password: { type: "string", example: "secret123" },
            role: { type: "string", example: "user" },
          },
        },
        RegisterResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            message: {
              type: "string",
              example: "User registered successfully",
            },
            user: {
              type: "object",
              properties: {
                id: { type: "string", example: "1" },
                name: { type: "string", example: "John Doe" },
                email: { type: "string", example: "johndoe@example.com" },
                role: { type: "string", example: "user" },
              },
            },
          },
        },
        Login: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "johndoe@example.com" },
            password: { type: "string", example: "secret123" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            message: { type: "string", example: "Login successful" },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: {
              type: "object",
              properties: {
                id: { type: "string", example: "1" },
                name: { type: "string", example: "John Doe" },
                email: { type: "string", example: "johndoe@example.com" },
                role: { type: "string", example: "user" },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;

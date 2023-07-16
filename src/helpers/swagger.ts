import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WineModel API",
      version: "1.0.0",
      description: "This is the wine API",
      contact: {
        name: "Mathias Schuh",
        email: "mathias.schuh@gmx.de",
      },
    },
    servers: [
      {
        url: "http://localhost:3002/api/v1/",
        description: "Local DEV",
      },
      {
        url: "http://localhost:3003/api/v1/",
        description: "Docker DEV",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/*Model.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

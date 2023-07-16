import { Router, Request, Response } from "express";
import { WineModel } from "../models/wineModel";
import { validationResult, query, param } from "express-validator";
import * as _ from "lodash";
import { IQuery } from "../interfaces/queryInterface";

const wineRouterV1 = Router();

/**
 * @openapi
 * tags:
 *   name: Wines
 *   description: The wine managing API
 * components:
 *   schemas:
 *     WineSearch:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the wine
 *           example: Riesling
 *           nullable: true
 *         year:
 *           type: number
 *           description: Year of the wine
 *           example: 2015
 *           nullable: true
 *         country:
 *           type: string
 *           description: Country of the wine
 *           example: Germany
 *           nullable: true
 *         type:
 *           type: string
 *           description: Type of the wine
 *           example: white
 *           nullable: true
 *           enum:
 *             - red
 *             - white
 *             - rose
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Human readable error message
 *               example: Internal server error
 *             code:
 *               type: string
 *               description: Error code
 *               example: InternalError
 *     ValidationError:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           description: Type of error
 *           example: field
 *         value:
 *           type: string
 *           description: Value of the field
 *           example: 1
 *         msg:
 *           type: string
 *           description: Human readable error message
 *           example: Invalid value
 *         path:
 *           type: string
 *           description: Path of the value
 *           example: id
 *         location:
 *           type: string
 *           description: Location of the value
 *           example: params
 *
 * /wines:
 *   get:
 *     summary: Get all wines
 *     description: >
 *       Get an array of all wines.
 *       There is a limit of up to 50 wines you can get per request.
 *       You can use the offset parameter to get the next 50 wines.
 *       This limit is useful for pagination and avoids size and timeout problems with large data sets.
 *       If the limit is 50 and the offset is 50, the request will return the wines 51 to 100.
 *     tags: [Wines]
 *     parameters:
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           description: Offset of the query
 *           example: 0
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 50
 *           default: 50
 *           description: Limit of the query
 *           example: 50
 *     responses:
 *       200:
 *         description: Returns a wine.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 offset:
 *                   type: number
 *                   description: Offset of the query.
 *                   example: 0
 *                   minimum: 0
 *                   default: 0
 *                 limit:
 *                   type: number
 *                   description: Limit of the query
 *                   example: 50
 *                   minimum: 1
 *                   maximum: 50
 *                   default: 50
 *                 totalNumber:
 *                   type: number
 *                   description: Total number of wines in the database
 *                   example: 999
 *                 wines:
 *                   type: array
 *                   description: List of wines
 *                   items:
 *                      $ref: '#/components/schemas/WineModel'
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Human readable error message
 *                       example: Invalid parameters
 *                     code:
 *                       type: string
 *                       description: Error code
 *                       example: ValidationError
 *                     errors:
 *                       type: array
 *                       description: Detailed list of errors
 *                       items:
 *                         $ref: '#/components/schemas/ValidationError'
 *       500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
wineRouterV1.get(
  "/wines",
  [
    query("offset").optional().isInt({ min: 0 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: "Invalid parameters",
          code: "ValidationError",
          errors: errors.array(),
        },
      });
    }

    try {
      const offset = req.query.offset
        ? parseInt(req.query.offset as string)
        : 0;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const totalNumber = await WineModel.countDocuments();

      const wines = await WineModel.find({}, "name year country type")
        .skip(offset)
        .limit(limit);
      res.status(200).json({ offset, limit, totalNumber, wines });
    } catch (error) {
      let errorMessage = "unexpected error at get wines";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
      res
        .status(500)
        .json({ error: { message: errorMessage, code: "UnknownError" } });
    }
  },
);

/**
 * @openapi
 * /wine/{id}:
 *   get:
 *     summary: Get a wine by id
 *     description: Get information about a wine by id
 *     tags: [Wines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           description: The wine id
 *           example: 64b05d56945904c71fd12e07
 *     responses:
 *       200:
 *         description: Returns a wine.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/WineModelExtension'
 *                 - $ref: '#/components/schemas/WineModel'
 *                 - $ref: '#/components/schemas/WineModelDetails'
 *       400:
 *         description: Invalid id parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Human readable error message
 *                       example: Invalid parameters
 *                     code:
 *                       type: string
 *                       description: Error code
 *                       example: ValidationError
 *                     errors:
 *                       type: array
 *                       description: Detailed list of errors
 *                       items:
 *                         $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: ID not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Human readable error message
 *                       example: id not found
 *                     code:
 *                       type: string
 *                       description: Error code
 *                       example: UnknownId
 *                     id:
 *                       type: string
 *                       description: The id that was not found
 *                       example: 64b05d56945904c71fd12e07
 */
wineRouterV1.get(
  "/wine/:id",
  [param("id").isMongoId()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: "Invalid parameters",
          code: "ValidationError",
          errors: errors.array(),
        },
      });
    }

    try {
      const { id } = req.params;
      const wine = await WineModel.findById(id);
      if (!wine) {
        return res.status(404).json({
          error: { message: "id not found", code: "UnknownId", id: id },
        });
      }
      res.status(200).json(wine);
    } catch (error) {
      let errorMessage = "unexpected error at get wine";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
      res
        .status(500)
        .json({ error: { message: errorMessage, code: "UnknownError" } });
    }
  },
);

/**
 * @openapi
 * /wines/search:
 *   post:
 *     summary: Search wines
 *     description: Search wines by name, year, country and/or type
 *     tags: [Wines]
 *     requestBody:
 *       description: Search parameters. At least one parameter is required. All parameters are optional. If multiple parameters are provided, they are combined with OR.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WineSearch'
 *     responses:
 *       200:
 *         description: Returns a array of wines.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/WineModelExtension'
 *                 - $ref: '#/components/schemas/WineModel'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Human readable error message
 *                       example: at least one parameter is required
 *                     code:
 *                       type: string
 *                       description: Error code
 *                       example: ParameterMissing
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Human readable error message
 *                       example: nothing found for search parameters
 *                     code:
 *                       type: string
 *                       description: Error code
 *                       example: NoWinesFound
 *                     searchParams:
 *                       $ref: '#/components/schemas/WineSearch'

 */
wineRouterV1.post("/wines/search", async (req: Request, res: Response) => {
  try {
    const { name, year, country, type } = req.body;

    const query: IQuery = {
      $or: [],
    };
    if (name) {
      query.$or.push({ name: { $regex: name, $options: "i" } });
    }
    if (year) {
      query.$or.push({ year });
    }
    if (country) {
      query.$or.push({ country: { $regex: country, $options: "i" } });
    }
    if (type) {
      query.$or.push({ type: { $regex: type, $options: "i" } });
    }
    if (_.isEmpty(query.$or)) {
      return res.status(400).json({
        error: {
          message: "at least one parameter is required",
          code: "ParameterMissing",
        },
      });
    }

    const wines = await WineModel.find(query).exec();
    if (_.isEmpty(wines)) {
      return res.status(404).json({
        error: {
          message: "nothing found for search parameters",
          code: "NoWinesFound",
          searchParams: {
            name: name,
            year: year,
            country: country,
            type: type,
          },
        },
      });
    }
    res.status(200).json(wines);
  } catch (error) {
    let errorMessage = "Unexpected error at post wine search";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
    res
      .status(500)
      .json({ error: { message: errorMessage, code: "UnknownError" } });
  }
});

/**
 * @openapi
 * /wine:
 *   post:
 *     summary: Add a wine
 *     description: Add a new wine
 *     tags: [Wines]
 *     requestBody:
 *       description: Wine to add
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/WineModel'
 *               - $ref: '#/components/schemas/WineModelDetails'
 *     responses:
 *       201:
 *         description: Successfully added. Returns information about the added wine including the id.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/WineModelExtension'
 *                 - $ref: '#/components/schemas/WineModel'
 *                 - $ref: '#/components/schemas/WineModelDetails'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Human readable error message
 *                       example: Invalid parameters
 *                     code:
 *                       type: string
 *                       description: >
 *                         Error code. Expect one of the following:
 *                         - wineAlreadyExists => wine with same name and year and country and type already exists
 *                         - ValidationError => some of the provided parameters are invalid or missing
 *                       example: ValidationError
 */
wineRouterV1.post("/wine", async (req: Request, res: Response) => {
  try {
    const wine = await WineModel.create(req.body);
    res.status(201).json({ message: "wine successfully added", wine: wine });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("E11000 duplicate key")
    ) {
      return res.status(400).json({
        error: { message: "wine already exists", code: "wineAlreadyExists" },
      });
    }
    if (
      error instanceof Error &&
      (error.message.includes("WineModel validation failed") ||
        error.message.includes("Cast to Number failed"))
    ) {
      return res
        .status(400)
        .json({ error: { message: error.message, code: "ValidationError" } });
    }
    let errorMessage = "Unexpected error at post wine";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(error);
    console.log(errorMessage);
    res
      .status(500)
      .json({ error: { message: errorMessage, code: "UnknownError" } });
  }
});

/**
 * @openapi
 * /wine:
 *   put:
 *     summary: Update a wine
 *     description: Change the information of a wine
 *     tags: [Wines]
 *     requestBody:
 *       description: ID of the wine to update and the new information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - type: object
 *                 properties:
 *                    id:
 *                      type: string
 *                      description: ID of the wine to update
 *                      example: 5f9b3b2b9b0b3b1b9b0b3b1b
 *               - $ref: '#/components/schemas/WineModel'
 *               - $ref: '#/components/schemas/WineModelDetails'
 *     responses:
 *       200:
 *         description: Successfully added. Returns information about the added wine including the id.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/WineModelExtension'
 *                 - $ref: '#/components/schemas/WineModel'
 *                 - $ref: '#/components/schemas/WineModelDetails'
 *       400:
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        description: Human readable error message
 *                        example: Invalid parameters
 *                      code:
 *                        type: string
 *                        description: >
 *                          Error code. Expect one of the following:
 *                          - wineAlreadyExists => wine with same name and year and country and type already exists
 *                          - ValidationError => some of the provided parameters are invalid or missing
 *                        example: ValidationError
 *       404:
 *         description: ID not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Human readable error message
 *                       example: id not found
 *                     code:
 *                       type: string
 *                       description: Error code
 *                       example: UnknownId
 *                     id:
 *                       type: string
 *                       description: The id that was not found
 *                       example: 64b05d56945904c71fd12e07
 */
wineRouterV1.put(
  "/wine/:id",
  [param("id").isMongoId()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: "Invalid parameters",
          code: "ValidationError",
          errors: errors.array(),
        },
      });
    }

    try {
      const { id } = req.params;
      const wine = await WineModel.findByIdAndUpdate(id, req.body);
      if (!wine) {
        return res.status(404).json({
          error: { message: "id not found", code: "UnknownId", id: id },
        });
      }
      const updatedWine = await WineModel.findById(id);
      res.status(200).json(updatedWine);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("E11000 duplicate key")
      ) {
        return res.status(400).json({
          error: {
            message: "wine already exists",
            code: "wineAlreadyExists",
          },
        });
      }
      if (
        error instanceof Error &&
        (error.message.includes("WineModel validation failed") ||
          error.message.includes("Cast to Number failed"))
      ) {
        return res
          .status(400)
          .json({ error: { message: error.message, code: "ValidationError" } });
      }
      let errorMessage = "Unexpected error at put wine";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
      res
        .status(500)
        .json({ error: { message: errorMessage, code: "UnknownError" } });
    }
  },
);

/**
 * @openapi
 * /wine/{id}:
 *   delete:
 *     summary: Delete a wine by id
 *     description: Delete a wine by id
 *     tags: [Wines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           description: The wine id
 *           example: 64b05d56945904c71fd12e07
 *     responses:
 *       200:
 *         description: Returns the information of the deleted wine.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The confirmation message
 *                   example: wine successfully deleted
 *                 wine:
 *                   allOf:
 *                     - $ref: '#/components/schemas/WineModelExtension'
 *                     - $ref: '#/components/schemas/WineModel'
 *       400:
 *         description: Invalid id parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Human readable error message
 *                       example: Invalid parameters
 *                     code:
 *                       type: string
 *                       description: Error code
 *                       example: ValidationError
 *                     errors:
 *                       type: array
 *                       description: Detailed list of errors
 *                       items:
 *                         $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: ID not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Human readable error message
 *                       example: id not found
 *                     code:
 *                       type: string
 *                       description: Error code
 *                       example: UnknownId
 *                     id:
 *                       type: string
 *                       description: The id that was not found
 *                       example: 64b05d56945904c71fd12e07
 *
 */
wineRouterV1.delete(
  "/wine/:id",
  [param("id").isMongoId()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: "Invalid parameters",
          code: "ValidationError",
          errors: errors.array(),
        },
      });
    }

    try {
      const { id } = req.params;
      const wine = await WineModel.findByIdAndDelete(id);
      if (!wine) {
        return res.status(404).json({
          error: { message: "id not found", code: "UnknownId", id: id },
        });
      }
      res
        .status(200)
        .json({ message: "wine successfully deleted", wine: wine });
    } catch (error) {
      let errorMessage = "unexpected error at delete wine";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
      res
        .status(500)
        .json({ error: { message: errorMessage, code: "UnknownError" } });
    }
  },
);

export default wineRouterV1;

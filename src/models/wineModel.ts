import { Model, model, Schema, Types } from "mongoose";
import { IWine } from "../interfaces/wineInterface";
/**
 * @openapi
 * components:
 *   schemas:
 *     WineModel:
 *       type: object
 *       required:
 *         - name
 *         - year
 *         - country
 *         - type
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the wine
 *           example: Riesling
 *           minLength: 3
 *           maxLength: 50
 *         year:
 *           type: number
 *           description: Year of the wine
 *           example: 2019
 *         country:
 *           type: string
 *           description: Country of the wine
 *           example: Germany
 *           minLength: 3
 *           maxLength: 50
 *         type:
 *           type: string
 *           description: Type of the wine
 *           example: white
 *           enum:
 *             - red
 *             - white
 *             - rose
 *     WineModelDetails:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *           description: Description of the wine
 *           example: This is a very good wine
 *         price:
 *           type: number
 *           description: Price of the wine in Euro
 *           example: 12.99
 *     WineModelExtension:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The wine id
 *           example: 64b05d56945904c71fd12e07
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date of creation
 *           example: 2023-07-12T18:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date of the last update
 *           example: 2021-07-12T19:30:00.000Z
 */

const wineSchema = new Schema<IWine>(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 200,
      unique: false,
      required: true,
    },
    year: {
      type: Number,
      min: 0,
      max: 2099,
      unique: false,
      required: true,
    },
    country: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 150,
      unique: false,
      required: true,
    },
    type: {
      type: String,
      enum: ["red", "white", "rose"],
      trim: true,
      unique: false,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: false,
    },
    price: {
      type: Number,
      required: false,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// remove _id and __v from responses and replace _id with id
wineSchema.virtual("id").get(function (this: { _id: Types.ObjectId }) {
  return this._id.toHexString();
});
wineSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

wineSchema.index({ name: 1, year: 1, country: 1, type: 1 }, { unique: true });

export const WineModel: Model<IWine> = model<IWine>("WineModel", wineSchema);

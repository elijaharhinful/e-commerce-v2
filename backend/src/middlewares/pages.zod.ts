import { Request, Response, NextFunction } from "express";
import { AnyZodObject, z } from "zod";
import { error } from "../utils/response.util";
import mongoose from "mongoose";


export const PageSchema = z.object({
    title: z.string({ invalid_type_error: "Page title should be a string", required_error: "Page title is required" }),
    slug: z.string({ invalid_type_error: "Slug must be a string" }).optional(),
    content: z.any({ required_error: "Content is required" }),
    sorting: z.number().optional(),
})

// export const validatePageDetails =
//     (schema: AnyZodObject) => async (
//         req: Request,
//         res: Response,
//         next: NextFunction
//     ) => {
//         try {
//             await schema.parseAsync({
//                 body: req.body,
//                 query: req.query,
//                 params: req.params,
//             })
//             return next();
//         } catch (err: any) {
//             const messages = err.issues.map((issue: { message: string }) => issue.message);
//             const errorMessage = messages.join("\n"); // Concatenate error messages
//             return error(res, errorMessage, 500);
//         }
//     }

export const PageIdSchema = z.string({
    invalid_type_error: "Page id should be a string",
    required_error: "Page id is required"
})
    .refine(value => mongoose.Types.ObjectId.isValid(value), {
        message: "Invalid page Id",
    })
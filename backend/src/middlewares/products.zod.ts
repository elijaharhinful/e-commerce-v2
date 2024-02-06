import { Request, Response, NextFunction } from "express";
import { AnyZodObject, z } from "zod";
import { error } from "../utils/response.util";
import mongoose from "mongoose";


export const ProductSchema = z.object({
    title: z.string({ invalid_type_error: "Product name should be a string!", required_error: "Product name is required!" }),
    slug: z.string({ invalid_type_error: "Slug must be a string" }).optional(),
    desc: z.any({ required_error: "Product descrition is required!" }),
    category: z.string({ required_error: "Product category is required!" }),
    initialPrice: z.number({ invalid_type_error: "Initial price must be a number", required_error: "Initial price is required" }),
    price: z.number({ invalid_type_error: "Price must be a number", required_error: "Price is required" }),
    image: z.string({ invalid_type_error: "Image url must be a string" }).optional(),
    discount: z.number({ invalid_type_error: "discount must be a number" }).optional(),
    rating: z.number({ invalid_type_error: "Rating must be a number", required_error: "Rating is required" }),
    numReviews: z.number({ invalid_type_error: "Review number must be a number", required_error: "Number of reviews is required" }),
    quantity: z.number({ invalid_type_error: "Quantity must be a number", required_error: "Quantity is required" }),
})

export const ProductIdSchema = z.string({
    invalid_type_error: "Product id should be a string",
    required_error: "Product id is required"
})
    .refine(value => mongoose.Types.ObjectId.isValid(value), {
        message: "Invalid product Id",
    });

export const ProductReviewSchema = z.object({
    name: z.string({ invalid_type_error: "Name must be a string!", required_error: "Name is required!" }),
    rating: z.number({ invalid_type_error: "Rating must be a number", required_error: "Rating is required!" }),
    comment: z.string({ invalid_type_error: "Comment must be a string", required_error: "Comment is required!" }),
});

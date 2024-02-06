import {
    Route,
    Get,
    Controller,
    Post,
    Tags,
    Body,
    Path,
    Put,
    Delete
} from "tsoa";
import { ProductDetailsData } from "../interfaces/products.interface";
import {
    NotFoundError,
    CustomError,
    BadRequestError
} from "../middlewares/error.middleware";
import { ApiResponse } from "../interfaces/response.interface";
import { getProductDetailsService, getProductsByCategoryService, getProductsService, postProductReviewService } from "../services/products.service";
import category from "../models/category";
import product from "../models/product";
import { ProductIdSchema, ProductReviewSchema } from "../middlewares/products.zod";


// Fetch all products
@Route("/api/products")
@Tags("Products")
export class GetProductsController extends Controller {
    @Get()
    public async getProducts(): Promise<ApiResponse<ProductDetailsData[]>> {
        try {
            const data = await getProductsService();
            if (!data || data.length === 0) throw new NotFoundError("Products not found");
            return {
                successful: true,
                message: "Products fetched successfully!",
                data
            }
        } catch (err: any) {
            console.error(err);
            throw new CustomError(err.message, 500)
        }
    }
}

// Get products by category
@Route('/api/products/{category}')
@Tags('Products')
export class ProductsByCategoriesController extends Controller {
    @Get()
    public async getproductsByCategory(
        @Path() category: string
    ): Promise<ApiResponse<ProductDetailsData>> {
        try {
            const data = await getProductsByCategoryService(category);
            if (!data || data.length == 0 ) throw new NotFoundError("Products not found!");
            return {
                successful: true,
                message: "Products fetched successfully!",
                data
            }
        } catch (err: any) {
            console.error(err);
            throw new CustomError(err.message, 500);
        }
    }
}

// Get product details
@Route('/api/products/{category}/{product_name}')
@Tags('Products')
export class GetProductsDetailsController extends Controller {
    @Get()
    public async getProductDetails(@Path() product_name: string): Promise<ApiResponse<ProductDetailsData>> {
        try {
            const product = await getProductDetailsService(product_name);
            return {
                successful: true,
                message: "Product details fetched successfully!",
                data: product
            }
        } catch (err: any) {
            throw new CustomError(err.message, 500);
        }
    }
}

// Post product review
@Route('/api/products/{catergory}/{product_name}/review/{product_id}')
@Tags('Products')
export class PostProductReviewController extends Controller {
    @Put()
    public async postReview(
        @Path() product_id: string,
        @Path() product_name: string,
        @Body() review: ProductDetailsData
    ): Promise<ApiResponse<ProductDetailsData[]>> {
        try {
            const validatedProductId = ProductIdSchema.parse(product_id);
            const validatedProductReview = ProductReviewSchema.parse(review);
            const validatedReview = await postProductReviewService(validatedProductId, product_name,validatedProductReview);
            console.log(validatedReview)
            return {
                successful: true,
                message: "Page edited successfully!",
                data: validatedReview
            };
        } catch (err: any) {
            throw new CustomError(err.message, 500);
        }
    }
}

// // Post delete page
// @Route('/api/delete-page/{page_id}')
// @Tags('Pages')
// export class DeletePageController extends Controller {
//     @Delete()
//     public async deletePage(
//         @Path() page_id: string
//     ): Promise<ApiResponse<PageDetailsData[]>> {
//         try {
//             const validatedId = PageIdSchema.parse(page_id);
//             const sortedPages = await deletePageService(validatedId);
//             return {
//                 successful: true,
//                 message: "Page deleted successfully!",
//                 data: sortedPages
//             };
//         } catch (err: any) {
//             console.error(err);
//             throw new CustomError(err.message.message, 500);
//         }
//     }
// }


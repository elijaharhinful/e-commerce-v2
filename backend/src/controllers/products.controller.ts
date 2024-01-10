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
import { getProductsByCategoryService, getProductsService } from "../services/products.service";
import category from "../models/category";


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

// // Get page by Id
// @Route('/api/page/{page_id}')
// @Tags('Pages')
// export class GetPageByIdController extends Controller {
//     @Get()
//     public async getPageById(@Path() page_id: string): Promise<ApiResponse<PageDetailsData>> {
//         try {
//             const validatedId = PageIdSchema.parse(page_id);
//             const page = await getPageByIdService(validatedId);
//             return {
//                 successful: true,
//                 message: "Pages fetched successfully!",
//                 data: page
//             }
//         } catch (err: any) {
//             throw new CustomError(err.message, 500);
//         }
//     }
// }

// // Post edited page
// @Route('/api/edit-page/{page_id}')
// @Tags('Pages')
// export class EditPageController extends Controller {
//     @Put()
//     public async editPage(
//         @Path() page_id: string,
//         @Body() page: PageDetailsData
//     ): Promise<ApiResponse<PageDetailsData[]>> {
//         try {
//             const validatedId = PageIdSchema.parse(page_id);
//             const validatedPage = PageSchema.parse(page);
//             const sortedPages = await editPageService(validatedId, validatedPage);
//             console.log(sortedPages)
//             return {
//                 successful: true,
//                 message: "Page edited successfully!",
//                 data: sortedPages
//             };
//         } catch (err: any) {
//             throw new CustomError(err.message, 500);
//         }
//     }
// }

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


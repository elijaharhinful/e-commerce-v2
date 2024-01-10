import { Request, Response } from "express";
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
import {
    createPageService,
    getPagesService,
    reorderPagesService,
    getPageByIdService,
    editPageService,
    deletePageService
} from "../services/pages.service";
import { PageDetailsData } from "../interfaces/pages.interface";
import { PageSchema, PageIdSchema } from "../middlewares/pages.zod";
import {
    NotFoundError,
    CustomError,
    BadRequestError
} from "../middlewares/error.middleware";
import { ApiResponse } from "../interfaces/response.interface";
import {z} from "zod";


// Fetch all pages
@Route("/api/pages")
@Tags("Pages")
export class GetPagesController extends Controller {
    @Get()
    public async getPages(): Promise<ApiResponse<PageDetailsData[]>> {
        try {
            const data = await getPagesService();
            if (!data || data.length === 0) throw new NotFoundError("Pages not found");
            return {
                successful: true,
                message: "Pages fetched successfully!",
                data
            }
        } catch (err: any) {
            console.error(err);
            throw new CustomError(err.message, 500)
        }
    }
}

// Create page
@Route('/api/add-page')
@Tags('Pages')
export class CreatePageController extends Controller {
    @Post()
    public async createPage(
        @Body() request: PageDetailsData
    ): Promise<ApiResponse<PageDetailsData>> {
        try {
            // Validate the request using Zod
            const requestData = PageSchema.parse(request) as PageDetailsData;
            // Call the createPageService with the validated data
            const data = await createPageService(requestData);

            if (typeof data === 'string') {
                // Handle the error message and return it in the response
                return {
                    successful: false,
                    message: data,
                    data: ""
                };
            } else {
                // Page created successfully, return the success response
                return {
                    successful: true,
                    message: "Page added!",
                    data: data
                };
            }
        } catch (err: any) {
            // If Zod validation fails, it throws an error. Catch it and return a response.
            if (err instanceof z.ZodError) {
                return {
                    successful: false,
                    message: err.errors[0].message,  // Get the first error message
                    data: ""
                };
            }
            console.error(err);
            throw new CustomError(err.message, 500)
        }
    }
}

// Re-order pages
@Route('/api/reorder-pages')
@Tags('Pages')
export class ReorderPagesController extends Controller {
    @Post()
    public async reorderPages(@Body() ids: string[]): Promise<ApiResponse<PageDetailsData[]>> {
        try {
            await reorderPagesService(ids);
            return {
                successful: true,
                message: "Pages reordered successfully!",
                data: []
            }
        } catch (err: any) {
            throw new CustomError(err.message, 500);
        }
    }
}

// Get page by Id
@Route('/api/page/{page_id}')
@Tags('Pages')
export class GetPageByIdController extends Controller {
    @Get()
    public async getPageById(@Path() page_id: string): Promise<ApiResponse<PageDetailsData>> {
        try {
            const validatedId = PageIdSchema.parse(page_id);
            const page = await getPageByIdService(validatedId);
            return {
                successful: true,
                message: "Pages fetched successfully!",
                data: page
            }
        } catch (err: any) {
            throw new CustomError(err.message, 500);
        }
    }
}

// Post edited page
@Route('/api/edit-page/{page_id}')
@Tags('Pages')
export class EditPageController extends Controller {
    @Put()
    public async editPage(
        @Path() page_id: string,
        @Body() page: PageDetailsData
    ): Promise<ApiResponse<PageDetailsData[]>> {
        try {
            const validatedId = PageIdSchema.parse(page_id);
            const validatedPage = PageSchema.parse(page);
            const sortedPages = await editPageService(validatedId, validatedPage);
            console.log(sortedPages)
            return {
                successful: true,
                message: "Page edited successfully!",
                data: sortedPages
            };
        } catch (err: any) {
            throw new CustomError(err.message, 500);
        }
    }
}

// Post delete page
@Route('/api/delete-page/{page_id}')
@Tags('Pages')
export class DeletePageController extends Controller {
    @Delete()
    public async deletePage(
        @Path() page_id: string
    ): Promise<ApiResponse<PageDetailsData[]>> {
        try {
            const validatedId = PageIdSchema.parse(page_id);
            const sortedPages = await deletePageService(validatedId);
            return {
                successful: true,
                message: "Page deleted successfully!",
                data: sortedPages
            };
        } catch (err: any) {
            console.error(err);
            throw new CustomError(err.message.message, 500);
        }
    }
}


import { Request, Response } from "express";
import {
    Route,
    Get,
    Controller,
    Post,
    Tags,
    Body,
    Res,
    Path
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
import { success } from "../utils/response.util";


// Fetch all pages
@Route("/pages")
@Tags("Pages")
export class GetPagesController extends Controller {
    @Get()
    public async getPages(@Res() res: Response): Promise<Response> {
        try {
            const data = await getPagesService();
            if (!data || data.length === 0) throw new NotFoundError("Pages not found");
            // return data;
            return success(res, data, "Pages fetched successfully");
        } catch (err: any) {
            console.error(err);
            throw new CustomError(err.message, 500)
        }
    }
}

// Create page
@Route('/add-page')
@Tags('Pages')
export class CreatePageController extends Controller {
    @Post()
    public async createPage(
        @Body() request: PageDetailsData,
        @Res() res: Response
    ): Promise<Response> {
        try {
            // Validate the request using Zod
            const requestData = PageSchema.parse(request) as PageDetailsData;

            // Call the createPageService with the validated data
            const data = await createPageService(requestData);
            return success(res, data, "Page added!"); // use success function
        } catch (err: any) {
            if (err instanceof CustomError && err.message === "Page slug exists, choose another.") {
                throw new BadRequestError(err.message); // throw BadRequestError
            }
            throw new CustomError(err.message, 400); // throw a CustomError with 400 status code
        }
    }
}

// Re-order pages
@Route('/reorder-pages')
@Tags('Pages')
export class ReorderPagesController extends Controller {
    @Post()
    public async reorderPages(@Body() ids: string[], @Res() res: Response): Promise<Response> {
        try {
            await reorderPagesService(ids);
            return success(res, null, "Pages reordered successfully!");
        } catch (err: any) {
            throw new CustomError(err.message, 500);
        }
    }
}

// Get page by Id
@Route('/page/{id}')
@Tags('Pages')
export class GetPageByIdController extends Controller {
    @Get()
    public async getPageById(@Path() id: string, @Res() res: Response): Promise<Response> {
        try {
            const validatedData = PageIdSchema.parse({id});
            const page = await getPageByIdService(validatedData.id);
            return success(res, {
                title: page.title,
                slug: page.slug,
                content: page.content,
                id: page._id,
            }, "Page fetched successfully!");
        } catch (err: any) {
            throw new CustomError(err.message, 500);
        }
    }
}

// post edited page
@Route('/edit-page/{id}')
@Tags('Pages')
export class EditPageController extends Controller {
    @Post()
    public async editPage(@Path() id: string, @Body() page: PageDetailsData, @Res() res: Response): Promise<Response> {
        try {
            const validatedData = PageIdSchema.parse({ id });
            const validatedPage = PageSchema.parse(page);
            const sortedPages = await editPageService(validatedData.id, validatedPage);
            return success(res, sortedPages, "Page edited successfully!");
        } catch (err: any) {
            throw new CustomError(err.message, 500);
        }
    }
}

// post delete page
@Route('/delete-page/{id}')
@Tags('Pages')
export class DeletePageController extends Controller {
    @Get()
    public async deletePage(@Path() id: string, @Res() res: Response): Promise<Response> {
        try {
            const validatedData = PageIdSchema.parse({ id });
            const sortedPages = await deletePageService(validatedData.id);
            return success(res, sortedPages, "Page deleted successfully!");
        } catch (err: any) {
            throw new CustomError(err.message, 500);
        }
    }
}


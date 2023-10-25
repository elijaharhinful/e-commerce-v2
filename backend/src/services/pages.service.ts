import {
    BadRequestError,
    CustomError,
    NotFoundError
} from "../middlewares/error.middleware";
import PageModel from "../models/page";
import { PageDetailsData } from "../interfaces/pages.interface";

// get all pages
export const getPagesService = async (): Promise<PageDetailsData[]> => {
    try {
        const pages = await PageModel.find({}).sort({ sorting: 1 });
        if (!pages) throw new NotFoundError("Pages not found");

        return pages;
    } catch (error) {
        console.error("Error while getting pages:", error);
        throw new CustomError("An error occurred while getting pages", 500);
    }
};

// create page
export const createPageService = async (page: PageDetailsData) => {
    try {
        // If slug is not provided in request, create it from title
        let slug = page.slug ? page.slug.replace(/\s+/g, "-").toLowerCase() : page.title.replace(/\s+/g, "-").toLowerCase();
        // Check if page with same slug already exists
        const existingPage = await PageModel.findOne({ slug: slug });
        if (existingPage) {
            throw new BadRequestError("Page slug exists, choose another.");
        }
        // Create new page
        const newPage = {
            title: page.title,
            slug: slug,
            content: page.content,
            sorting: 100,
        };
        return await PageModel.create(newPage);
    } catch (error) {
        console.error("error creating page")
        throw new CustomError("An error occured while getting page")
    }
}

// re-order pages
export const reorderPagesService = async (ids: string[]) => {
    try {
        for (let i = 0; i < ids.length; i++) {
            let id = ids[i];
            let page = await PageModel.findById(id);
            if (page) {
                page.sorting = i;
                await page.save();
            } else {
                throw new NotFoundError(`Page with id ${id} not found.`);
            }
        }
    } catch (error) {
        console.error("error reordering pages");
        throw new CustomError("An error occurred while reordering pages", 500);
    }
}

// get page by Id
export const getPageByIdService = async (id: string) => {
    try {
        const page = await PageModel.findById(id);
        if (!page) {
            throw new NotFoundError(`Page with id ${id} not found.`);
        }
        return page;
    } catch (error) {
        console.error("error getting page");
        throw new CustomError("An error occurred while getting page", 500);
    }
}

// post edited page
export const editPageService = async (id: string, page: any) => {
    try {
        const pageDetails: PageDetailsData = {
            title: page.title,
            slug: page.slug,
            content: page.content
        };
        const existingPage = await PageModel.findOne({ slug: pageDetails.slug, _id: { $ne: id } });
        if (existingPage) {
            throw new BadRequestError("Page slug exists, choose another.");
        }
        const updatedPage = await PageModel.findByIdAndUpdate(id, pageDetails, { new: true });
        if (!updatedPage) {
            throw new NotFoundError(`Page with id ${id} not found.`);
        }
        const sortedPages = await getPagesService();
        return sortedPages;
    } catch (error) {
        console.error("error editing page");
        throw new CustomError("An error occurred while editing page", 500);
    }
}

// post delete page
export const deletePageService = async (id: string) => {
    try {
        const deletedPage = await PageModel.findByIdAndRemove(id);
        if (!deletedPage) {
            throw new NotFoundError(`Page with id ${id} not found.`);
        }
        const sortedPages = await getPagesService();
        return sortedPages;
    } catch (error) {
        console.error("error deleting page");
        throw new CustomError("An error occurred while deleting page", 500);
    }
}

import {
    BadRequestError,
    CustomError,
    NotFoundError
} from "../middlewares/error.middleware";
import ProductModel from "../models/product";
import CategoryModel from "../models/category";
import { ProductDetailsData } from "../interfaces/products.interface";



// get all products
export const getProductsService = async (): Promise<ProductDetailsData[]> => {
    try {
        const products = await ProductModel.find({});
        if (!products) throw new NotFoundError("Products not found");

        return products;
    } catch (error) {
        console.error("Error while getting products:", error);
        throw new CustomError("An error occurred while getting products", 500);
    }
};

// get products by category
export const getProductsByCategoryService = async (category: string) => {
    try {
        const products = await ProductModel.find({category: category});
        if (!products) throw new NotFoundError("Products not found");

        return products;
    } catch (error) {
        console.error("Error while getting products:", error);
        throw new CustomError("An error occurred while getting products", 500);
    }
};

// // create page
// export const createPageService = async (page: PageDetailsData) => {
//     try {
//         // If slug is not provided in request, create it from title
//         let slug = page.slug ? page.slug.replace(/\s+/g, "-").toLowerCase() : page.title.replace(/\s+/g, "-").toLowerCase();
//         // Check if page with same slug already exists
//         const existingPage = await PageModel.findOne({ slug: slug });
//         if (existingPage) {
//             return "Page slug exists, choose another.";
//         }
//         // Create new page
//         const newPage = {
//             title: page.title,
//             slug: slug,
//             content: page.content,
//             sorting: 100,
//         };
//         return await PageModel.create(newPage);
//     } catch (error: any) {
//         console.error(error)
//         throw new CustomError("An error occured while creating page")
//     }
// }

// // re-order pages
// export const reorderPagesService = async (ids: string[]) => {
//     try {
//         for (let i = 0; i < ids.length; i++) {
//             let id = ids[i];
//             let page = await PageModel.findById(id);
//             if (page) {
//                 page.sorting = i;
//                 await page.save();
//             } else {
//                 throw new NotFoundError(`Page with id ${id} not found.`);
//             }
//         }
//     } catch (error) {
//         console.error("error reordering pages");
//         throw new CustomError("An error occurred while reordering pages", 500);
//     }
// }

// // get page by Id
// export const getPageByIdService = async (id: string) => {
//     try {
//         const page = await PageModel.findById(id);
//         if (!page) {
//             throw new NotFoundError(`Page with id ${id} not found.`);
//         }
//         return page;
//     } catch (error) {
//         console.error("error getting page");
//         throw new CustomError("An error occurred while getting page", 500);
//     }
// }

// // post edited page
// export const editPageService = async (page_id: string, page: any) => {
//     try {
//         const pageDetails: PageDetailsData = {
//             title: page.title,
//             slug: page.slug,
//             content: page.content
//         };
//         const existingPage = await PageModel.findOne({ slug: pageDetails.slug, _id: { $ne: page_id } });
//         if (!existingPage) {
//             throw new BadRequestError("Page does not exist!");
//         }
//         const updatedPage = await PageModel.findByIdAndUpdate(page_id, pageDetails, { new: true });
//         if (!updatedPage) {
//             throw new NotFoundError(`Page with id ${page_id} not found.`);
//         }
//         const sortedPages = await getPagesService();
//         return sortedPages;
//     } catch (error) {
//         console.error(error);
//         throw new CustomError("An error occurred while editing page", 500);
//     }
// }

// // post delete page
// export const deletePageService = async (page_id: string) => {
//     try {
//         const deletedPage = await PageModel.findByIdAndRemove(page_id);
//         if (!deletedPage) {
//             throw new NotFoundError(`Page with id ${page_id} not found.`);
//         }
//         const sortedPages = await getPagesService();
//         return sortedPages;
//     } catch (error) {
//         console.error(error);
//         throw new CustomError("An error occurred while deleting page", 500);
//     }
// }

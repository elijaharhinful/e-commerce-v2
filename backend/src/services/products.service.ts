import {
    BadRequestError,
    CustomError,
    NotFoundError
} from "../middlewares/error.middleware";
import ProductModel from "../models/product";
import CategoryModel from "../models/category";
import { ProductDetailsData } from "../interfaces/products.interface";
import { ProductReviewData } from "../interfaces/product.review.interface";


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
        const products = await ProductModel.find({ category: category });
        if (!products) throw new NotFoundError("Products not found");

        return products;
    } catch (error) {
        console.error("Error while getting products:", error);
        throw new CustomError("An error occurred while getting products", 500);
    }
};

// get product details
export const getProductDetailsService = async (product_name: string) => {
    try {
        const product = await ProductModel.find({ slug: product_name.toLowerCase() });
        if (!product) throw new NotFoundError("Product not found!");

        return product;
    } catch (error) {
        console.error("Error while getting product details:", error);
        throw new CustomError("An error occurred while getting product details", 500);
    }
};

// post product review
export const postProductReviewService = async (product_id: string, product_name: string, review: ProductReviewData) => {
    try {
        const newReview = {
            name: review.name,
            rating: review.rating,
            coment: review.comment
        };

        const product = await ProductModel.findById(product_id);
        if (!product) throw new NotFoundError("Product not found!");

        if (product) {
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((a:any, c:any) => c.rating + a, 0) / product.reviews.length;
        }

        const updatedProduct = await getProductDetailsService(product_name);
        return updatedProduct;
    } catch (error) {
        console.error(error);
        throw new CustomError("An error occurred while editing page", 500);
    }
}

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

import mongoose, { Schema } from "mongoose"; 
import { ProductCategory, ProductSize, ProductStatus, ProductStorage } from "../libs/enums/products.enum";

const productSchema = new Schema({
    productStatus: {
        type: String,
        enum: ProductStatus,
        default: ProductStatus.PAUSE
    },

    productCategory: {
        type: String,
        enum: ProductCategory,
        required: true
    },

    productName: {
        type: String,
        required: true
    },

    productPrice: {
        type: Number,
        required: true
    },

    productLeftCount: {
        type: Number,
        required: true
    },

    productSize: {
        type: String,
        enum: ProductSize,
        default: ProductSize.REGULAR
    },

    productStorage: {
        type: Number,
        enum: ProductStorage,
        default: ProductStorage.SIXTY_FOUR_GB
    },

    productDesc: {
        type: String,
        required: true
    },

    productImages: {
        type: [String],
        default: []
    },

    productViews: {
        type: Number,
        default: 0
    },
},
{timestamps: true} // updatedAt, createdAt
);

productSchema.index(
    { productName: 1, productSize: 1, productStorage: 1 },
    { unique: true }
);

export default mongoose.model('Product', productSchema);

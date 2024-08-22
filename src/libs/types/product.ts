import { ProductCollection, ProductSize, ProductStatus } from "../enums/products.enum";
import {ObjectId} from 'mongoose';

export interface Product {
    _id: ObjectId;
    productStatus: ProductStatus;
    productName: string;
    productPrice: number;
    productLeftCount: number;
    productLeftSize: ProductSize;
    productLeftVolume: number; 
    productDesc?: string;
    productImages: string[];
    productViews: number;
}

export interface ProductInput {
    productStatus?: ProductStatus;
    productName: string;
    productPrice: number;
    productLeftCount: number;
    productLeftSize?: ProductSize;
    productLeftVolume?: number; 
    productDesc?: string;
    productImages?: string[];
    productViews?: number;
}

export interface ProductUpdateInput {
    _id: ObjectId;
    productStatus?: ProductStatus;
    productName?: string;
    productPrice?: number;
    productLeftCount?: number;
    productLeftSize?: ProductSize;
    productLeftVolume?: number; 
    productSize: ProductSize;
    productVolume: number; 
    productDesc?: string;
    productImages?: string[];
    productViews?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductInquire {
    productCollection: ProductCollection;
    order: string;
    page: number;
    limit: number;
    search?: string; 
}
import { ProductSize, ProductStatus } from "../enums/products.enum";
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
    productDesc?: string;
    productImages?: string[];
    productViews?: number;
}

export interface ProductInquire {
    order: string;
    page: number;
    limit: number;
    search?: string; 
}
import { ProductStatus } from "../libs/enums/products.enum";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ProductInput, Product, ProductUpdateInput, ProductInquire } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { T } from "../libs/types/common";
import { ObjectId } from "mongoose";

class ProductService {
    private readonly productModel;
    
    constructor(){
        this.productModel = ProductModel;
    }


    //SPA
    //SSR

    // Create
    public async createNewProduct(input: ProductInput): Promise<any> {
        try {
            return await this.productModel.create(input);          
        } catch (error) {
            console.log("Error model:createNewProduct",error);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)
            
        }
    }

    // Get All
    public async getAllProducts(): Promise<any[]> {
        const result = await this.productModel.find().exec();
        if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    }

    //Update
    public async updateChosenProduct(id: string,input: ProductUpdateInput): Promise<any> {
        // string = Obeject id
        id = shapeIntoMongooseObjectId(id);
        const result = await this.productModel.findByIdAndUpdate({_id: id}, input, { new:true } ).exec();
        if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        console.log("result", result);

        return result;
        
    }

    public async getProducts(inquire: ProductInquire): Promise<Product[]>{
        const match: T = { productStatus: ProductStatus.PROCESS}

        if(inquire.search)
            match.productName = ({$regex: new RegExp(inquire.search, "i")});

            const sort: T = inquire.order === "ProductPrice"
            ? {[inquire.order]: 1}
            : {[inquire.order]: -1}

            const result = await this.productModel.aggregate([
                {$match: match},
                {$sort: sort},
                {$skip: (inquire.page * 1 - 1) * inquire.limit},
            ]).exec();

            if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
            return result;
    }

    public async getProduct(memberId: ObjectId | null, id: string): Promise<any>{
        const productId = shapeIntoMongooseObjectId(id);

        let result = await this.productModel
        .findOne({
            _id: productId, 
            productStatus: ProductStatus.PROCESS
        })
        .exec();

        if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        // TODO If authenticated users => first => view log creation

        return result;
    }
}

export default ProductService;
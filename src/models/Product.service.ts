import { ProductStatus } from "../libs/enums/products.enum";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ProductInput, Product, ProductUpdateInput, ProductInquire } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { T } from "../libs/types/common";
import {ObjectId} from 'mongoose';
import ViewServiceModel from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";

class ProductService {
    private readonly productModel;
    public viewService;
    
    constructor(){
        this.productModel = ProductModel;
        this.viewService = new ViewServiceModel;
    }


    //SPA

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


        if(memberId){
        // TODO If authenticated users => first => view log creation
        // Check view log existance
        const input: ViewInput = {
            memberId: memberId,
            viewRefId: productId,
            viewGroup: ViewGroup.PRODUCT
        }
        const existView = await this.viewService.checkViewExistence(input);

        console.log("exist",!!existView);
        
        if(!existView) {
        // Insert New View Log
            await this.viewService.insertMemberView(input);
        // Increase Target View 
            const result2 = await this.productModel
            .findByIdAndUpdate(
                productId, 
                {$inc: {productViews: +1}},
                {new: true}
                )
            
        }

        }

        return result;
    }
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
    public async getAllProducts(): Promise<any> {
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
}

export default ProductService;
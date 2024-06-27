import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ProductInput, Product, ProductUpdateInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";

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
}

export default ProductService;
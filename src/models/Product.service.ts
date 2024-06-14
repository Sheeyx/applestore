import { ProductInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { Product } from "../libs/types/product";
import { Message } from "../libs/Errors";
import { HttpCode } from "../libs/Errors";
import Errors from "../libs/Errors";

class ProductService {
    private readonly productModel;

    constructor(){
        this.productModel = ProductModel;
    }

     //SPA
    //SSR

    public async createNewProduct(input: ProductInput): Promise<any> {
        try {
            return await this.productModel.create(input);          
        } catch (error) {
            console.log("Error model:createNewProduct",error);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)

        }
    }
}

export default ProductService;
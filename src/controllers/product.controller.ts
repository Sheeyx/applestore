import {Request, Response} from 'express';
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from '../models/Product.service';
import { AdminRequest } from '../libs/types/member';
import { ProductInput } from '../libs/types/product';

const productController:T = {}
const productService = new ProductService();

// GET-ALL
productController.getAllProducts = async (req: Request, res: Response)=>{
    try {
        console.log("getAllProducts");
        res.render("product")
    } catch(err) {
        console.log("Error, getAllProducts", err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}

// CREATE
productController.createNewProduct = async (req: AdminRequest, res: Response) => {
    try {
      console.log("createNewProduct");
      console.log("req.files",req.files);
      
      if(!req.files?.length) 
        throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED)

    const data: ProductInput = req.body;
    data.productImages = req.files?.map((ele)=>{
        return ele.path;
    })

    console.log(data);
    
    await productService.createNewProduct(data);

    res.send(
        `<script>alert("Successfully creation!"); window.location.replace('admin/product/all')<script>`
        );
        
    
    } catch (err) {
      console.log("Error, createNewProduct", err);
      const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
      res.send(
        `<script>alert("${message}"); window.location.replace('admin/product/all')<script>`
      );
    }
  };

// UPDATE
productController.updateChosenProduct = async (req: Request, res: Response)=>{
    try {
        console.log("getAllProducts");
    } catch(err) {
        console.log("Error, getAllProducts", err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}

export default productController;
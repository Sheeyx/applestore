import express from 'express';
const routerAdmin = express.Router();
import storeController from './controllers/store.controller';
import productController from './controllers/product.controller';
import makeUploader from './libs/utils/uploader';


/* Stores */
routerAdmin.get('/', storeController.goHome);

routerAdmin
    .get('/login', storeController.getLogin)
    .post('/login', storeController.processLogin);

    routerAdmin
    .get("/signup", storeController.getSignup)
    .post(
      "/signup",
      makeUploader("members").single("memberImage"),
      storeController.processSignup
    );

routerAdmin.get('/check-me', storeController.checkAuthSession);
routerAdmin.get('/logout', storeController.logout);

/* Product */
routerAdmin.
    get(
    '/product/all', 
    storeController.verifyRestaurant,
    productController.getAllProducts
    )
    .post(
        "/product/create",
        storeController.verifyRestaurant,
        makeUploader("products").array("productImages",5),
        productController.createNewProduct
      )
    .post('/product/:id', 
    productController.createNewProduct,
    productController.updateChosenProduct);

/* User */

export default routerAdmin;
import express from 'express';
const routerAdmin = express.Router();
import storeController from './controllers/store.controller';
import productController from './controllers/product.controller';


/* Stores */
routerAdmin.get('/', storeController.goHome);

routerAdmin
    .get('/login', storeController.getLogin)
    .post('/login', storeController.processLogin);

routerAdmin
.post('/signup', storeController.processSignup);
routerAdmin.get('/check-me', storeController.checkAuthSession);
routerAdmin.get('/logout', storeController.logout);

/* Product */
routerAdmin
    .get('/product/all', productController.getAllProducts)
    .post('/product/create', productController.createNewProduct)
    .post('/product/:id', productController.updateChosenProduct);

/* User */

export default routerAdmin;
import express from 'express';
const routerAdmin = express.Router();
import storeController from './controllers/store.controller';


/* Stores */
routerAdmin.get('/', storeController.goHome);

routerAdmin
.get('/login', storeController.getLogin)
.post('/login', storeController.processLogin);

routerAdmin
.post('/signup', storeController.processSignup);

/* Product */
/* User */

export default routerAdmin;
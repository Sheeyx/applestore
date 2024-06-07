import {Request, Response} from 'express';
import {T} from "../libs/types/common";
import MemberService from '../models/Member.service';

const storeController : T = {};

storeController.goHome = (req: Request, res: Response) => {
    try{
        console.log("Go home");
        res.send("Home Page");
    } catch(err){
        console.log("Error, goHome", err);
    }
}

storeController.getLogin = (req: Request, res: Response) => {
    try{
        console.log("Go Login");
        res.send("Login Page");
    } catch(err){
        console.log("Error, getLogin", err);
    }
}

storeController.getSignup = (req: Request, res: Response) => {
    try{
        console.log("Go Signup");
        res.send("Signup Page");
    } catch(err){
        console.log("Error, getSignup", err);
    }
}

storeController.processLogin = (req: Request, res: Response) => {
    try{
        console.log("processLogin");
        res.send("Done");
    } catch(err){
        console.log("Error, processLogin", err);
    }
}

storeController.processSignup = (req: Request, res: Response) => {
    try{
        console.log("processSignup");
        res.send("Done");
    } catch(err){
        console.log("Error, processSignup", err);
    }
}

export default storeController;
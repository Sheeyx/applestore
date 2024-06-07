import {Request, Response} from 'express';
import {T} from "../libs/types/common";
import MemberService from '../models/Member.service';
import { MemberInput } from '../libs/types/member';
import { MemberType } from '../libs/enums/member.enum';

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

storeController.processSignup = async (req: Request, res: Response) => {
    try{
        console.log("processSignup");
        console.log("body: ",req.body);

        const newMember: MemberInput = req.body;
        newMember.memberType = MemberType.RESTAURANT;

        const memberService = new MemberService();
        const result = await memberService.processSignup(newMember);
        res.send(result);
    } catch(err){
        res.send(err);
        console.log("Error, processSignup", err);
    }
}

export default storeController;
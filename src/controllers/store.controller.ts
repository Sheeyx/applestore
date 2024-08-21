import {NextFunction, Request, Response} from 'express';
import {T} from "../libs/types/common";
import MemberService from '../models/Member.service';
import { MemberInput, LoginInput, AdminRequest } from '../libs/types/member';
import { MemberType } from '../libs/enums/member.enum';
import Errors, { HttpCode, Message } from '../libs/Errors';


const storeController : T = {};
const memberService = new MemberService();

storeController.goHome = (req: Request, res: Response) => {
    try{
        console.log("Go home");
        res.render("home");
    } catch(err){
        console.log("Error, goHome", err);
    }
}

storeController.getSignup = (req: Request, res: Response) => {
    try{
        console.log("Go Signup");

        // TODO: SESSIONS

        res.render("signup");
    } catch(err){
        console.log("Error, getSignup", err);
    }
}

storeController.getLogin =(req: Request, res: Response) => {
    try{
        console.log("Go Login");

        // TODO: SESSIONS

        res.render("login");
    } catch(err){
        console.log("Error, getLogin", err);
    }
}


storeController.processSignup = async (
  req: AdminRequest, 
  res: Response) => {
    try{
      console.log("processSignup");
      const file = req.file;
      if(!file)
        throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);
    
        const newMember: MemberInput = req.body;
        newMember.memberImage = file?.path.replace(/\\/g,"/"); 
        newMember.memberType = MemberType.STORE;
        const result = await memberService.processSignup(newMember);

        req.session.member = result;
        req.session.save(function(){
            res.redirect("/admin/product/all");
        });

    } catch(err){
        console.log("Error, processSignup", err);
        const message =
        err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
      res.send(
        `<script> alert("${message}"); window.location.replace('/admin/signup')</script>`      
        );
    }
}

storeController.processLogin = async (
    req: AdminRequest,
    res: Response
  ) => {
    try {
      console.log("processLogin");
      const input: LoginInput = req.body;
  
      const result = await memberService.processLogin(input);
  
      req.session.member = result;
      req.session.save(function () {
        res.redirect("/admin/product/all");
      });
    } catch (err) {
      console.log("Error, on Login Page", err);
      const message =
        err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
      res.send(
        `<script>alert(${message}); window.location.replace('admin/login')<script>`
      );
    }
  };


  storeController.checkAuthSession = async (
    req: AdminRequest,
    res: Response
  ) => {
    try {
      console.log("checkAuthSession");
      if (req.session?.member)
        res.send(` <script>alert("Hi ${req.session.member.memberNick}")<script>`);
      else res.send(`<script>alert("${Message.NOT_AUTHENTIFICATED}")<script>`);
    } catch (err) {
      console.log("Error, checkAuthSession", err);
      res.send(err);
    }
  };

  storeController.logout = async (
    req: AdminRequest,
    res: Response
  ) => {
    try {
      console.log("logout");
      req.session.destroy(function(){
        res.redirect("/admin")
      });
      
    } catch (err) {
      console.log("Error, on logout", err);
      res.send(err);
    }
  };

  storeController.getUsers = async (
    req: AdminRequest,
    res: Response
  ) => {
    try {
      console.log("getUsers");
      const result = await memberService.getUsers();
      console.log(result);
      
      res.render("users", {users: result});
    } catch (err) {
      console.log("Error, getUsers", err);
      res.redirect("/admin/login");
    }
  };

  storeController.updateChosenUsers = async (
    req: AdminRequest,
    res: Response
  ) => {
    try {
      console.log("updateChosenUsers");
      const result = await memberService.updateChosenUser(req.body);
      res.status(HttpCode.OK).json({data: result});

    } catch (err) {
      console.log("Error, updateChosenUsers", err);
      if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
  };

  storeController.verifyRestaurant = (
    req: AdminRequest,
    res: Response,
    next: NextFunction
  ) => {
    if(req.session?.member?.memberType === MemberType.STORE){        
        req.member = req.session.member;
        next();
      } else {
        const message = Message.NOT_AUTHENTIFICATED;
        res.send(
            `<script>alert("${message}"); window.location.replace('/admin/login');</script>`)
      }
  };

export default storeController;
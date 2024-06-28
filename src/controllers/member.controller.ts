import {Request, Response} from 'express';
import {T} from "../libs/types/common";
import { MemberInput, Member, LoginInput } from '..//libs/types/member';
import MemberService from '..//models/Member.service';
import Errors from '..//libs/Errors';

// REACT
const memberService = new MemberService();
const memberController : T = {};

memberController.signup = async (req: Request, res: Response) => {
    try{
        console.log("signup");
        const input: MemberInput = req.body;
        const result: Member = await memberService.signup(input);

        //TODO: TOKEN AUTHENTICATION

        res.json({member: result});
    } catch(err){
        console.log("Error, signup", err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
        // res.json(err);
    }
}

memberController.login = async (req: Request, res: Response) => {
    try {
      console.log("login");
      const input: LoginInput = req.body,
        result = await memberService.login(input);
      //    TODO: TOKENS AUTHENTICATION

      res.json({ member: result });
    } catch (err) {
      if (err instanceof Errors) res.status(err.code).json(err);
      else res.status(Errors.standard.code).json(Errors.standard);
    }
  };

export default memberController;

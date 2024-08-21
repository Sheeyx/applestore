import MemberModel from "../schema/Member.model";
import { LoginInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import * as bcrypt from "bcryptjs";
import { shapeIntoMongooseObjectId } from "../libs/config";

class MemberService {
    private readonly memberModel;
    constructor(){
        this.memberModel = MemberModel;
    }
    // SPA

    public async getMemberDetail(member: Member): Promise<any>{
        const memberId = shapeIntoMongooseObjectId(member._id);
        const result = await this.memberModel.findOne({
            _id: memberId, 
            memberStatus: MemberStatus.ACTIVE
        }).exec();

        if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    }

    public async updateMember(member: Member, input: MemberUpdateInput): Promise<any>{
        const memberId = shapeIntoMongooseObjectId(member._id);
        const result = await this.memberModel.findByIdAndUpdate({_id: memberId}, input, {new:true}).exec();
        if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        return result;
    }

    public async getTopUsers():Promise<any>{
        const result = await this.memberModel
        .find({
            memberStatus: MemberStatus.ACTIVE, 
            memberPoint: {$gte: 1}
        })
        .sort({memberPoint: -1})
        .limit(4)
        .exec();

        return result;
    }

    public async getRestaurant():Promise<any>{
        const result = await this.memberModel
        .findOne({memberType: MemberType.STORE})
        .exec();
        if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
       return result;
}

    public async signup(input: MemberInput):Promise<any>{

        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
            
        try {
            const result = await this.memberModel.create(input);
            result.memberPassword = "";
            return result.toJSON();
        } catch (error) {
            console.log("Error, model: signup",error);
            throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
        }
    }

    public async login(input: LoginInput):Promise<any>{
        // Consider member status later
        const member = await this.memberModel.findOne(
            {memberNick: input.memberNick, memberStatus: {$ne: MemberStatus.DELETE}},
            {memberNick: 1, memberPassword: 1, memberStatus: 1}
            ).exec();

            if(!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK)
            else if(member.memberStatus === MemberStatus.BLOCK){
                throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER)
            }

            const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
            //const isMatch = input.memberPassword === member.memberPassword;

            if (!isMatch) {
                throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
              }

            return await this.memberModel.findById(member._id).lean().exec();
    }

    // SSR

    public async processSignup(input: MemberInput):Promise<any>{
        const exist = await this.memberModel.findOne({memberType: MemberType.STORE}).exec();
        
        if(exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
            
        try {
            const result = await this.memberModel.create(input);
            return result;
        } catch (error) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
        // const tempResult = new this.memberModel(input);
        // const result = await tempResult.save();
        // result.memberPassword = "";
    }

    public async processLogin(input: LoginInput):Promise<any>{
        const member = await this.memberModel.findOne(
            {memberNick: input.memberNick},
            {memberNick: 1, memberPassword: 1}
            ).exec();

            if(!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

            const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
            //const isMatch = input.memberPassword === member.memberPassword;

            if (!isMatch) {
                throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
              }

            return await this.memberModel.findById(member._id).exec();
           
    }

    public async getUsers():Promise<any>{
        const result = await this.memberModel.find().exec();
 
        if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
 
        return result;
     }

    public async updateChosenUser(input: MemberUpdateInput):Promise<any>{
        input._id = shapeIntoMongooseObjectId(input._id);
        const result = 
        await this.memberModel
        .findByIdAndUpdate({_id: input._id}, input, {new: true}).exec();
 
        if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
 
        return result;
     }

     public async addUserPoint(
        member: Member, 
        point: number
        ):Promise<any>{
        const memberId = shapeIntoMongooseObjectId(member._id);

        return await this.memberModel
        .findByIdAndUpdate({
            _id: memberId, 
            memberType: MemberType.USER,
            memberStatus: MemberStatus.ACTIVE ,
        },
        { $inc: {memberPoint: point} },
        { new: true }
        )
        .exec();
    }
}

export default MemberService;   
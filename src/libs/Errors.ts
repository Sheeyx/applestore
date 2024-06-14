export enum HttpCode {
    OK = 200,
    CREATED = 201,
    NOT_MODIFIED = 304,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
    SOMETHING_WENT_WRONG = "Something went wrong",
    NO_DATA_FOUND = "No Data is found!",
    CREATE_FAILED = "Create is failed!",
    UPDATE_FAILED = "Update is failed!",
    USED_NICK_PHONE = "You are inserting already used nick or phone",
    NO_MEMBER_NICK = "No member with that member nick",
    WRONG_PASSWORD = "Wrong password, please try again ",
    NOT_AUTHENTIFICATED = "You are not authentificated, Please login first!"
}

class Errors extends Error {
    public code: HttpCode;
    public message: Message;
    
    static standard = {
        code: HttpCode.INTERNAL_SERVER_ERROR,
        Message: Message.SOMETHING_WENT_WRONG,
    };

    constructor(statusCode: HttpCode, statusMessage: Message){
        super()
    this.code = statusCode;
    this.message = statusMessage;
    }
}

export default Errors;
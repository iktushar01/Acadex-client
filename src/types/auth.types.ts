export interface ILoginResponse {
    token : string;
    accessToken : string;
    refreshToken : string;
    user : {
        needPasswordChange : boolean;
        email : string;
        name : string;
        role : string;
        image: string;
        status : string;
        isDeleted : boolean;
        emailVerified : boolean;
    }
}


export interface IRegisterResponse {
    success: boolean;
    message: string;
    data?: {
        user?: {
            id: string;
            email: string;
            name: string;
            role: string;
            image: string;
            status : string;
            isDeleted : boolean;
            emailVerified : boolean;
        };
    };
}


export interface IVerifyEmailResponse {
    success: boolean;
    message: string;
    data?: {
        user?: {
            id: string;
            email: string;
            name: string;
            role: string;
            image: string;
            status : string;
            isDeleted : boolean;
            emailVerified : boolean;
        };
    };
}

export interface UserFromCookie {
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
    image?: string | null;
}

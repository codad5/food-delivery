export interface User {
    name: string;
    phone: string;
    email?: string;
    password: string;
    verify: boolean
}

export interface UserDocument extends User, Document { }
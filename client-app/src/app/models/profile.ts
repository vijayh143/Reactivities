import { User } from "./user";

export interface IProfile {
    username : string;
    displayName : string;
    bio ?: string;
    image?: string;
    photos?: Photo[]
}

export class Profile implements IProfile {
    constructor(user : User) {
        this.username= user.username;
        this.displayName= user.displayName;
        this.image=user.image;
    }
    username : string;
    displayName : string;
    bio ?: string;
    image?: string;
    photos?: Photo[];
}

export interface Photo{
    id : string;
    url : string;
    isMain : boolean;
}
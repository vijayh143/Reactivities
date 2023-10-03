import { User } from "./user";

export interface IProfile {
    username : string;
    displayName : string;
    bio ?: string;
    image?: string;
    followerCount : number;
    followingCount : number;
    following : boolean;
    photos?: Photo[];
   

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
    followerCount = 0;
    followingCount = 0;
    following = false;
    photos?: Photo[];
   

}

export interface Photo{
    id : string;
    url : string;
    isMain : boolean;
}
export interface AuthResponse {
    status: string;
    message: string;
    data: UserData;
    access_token: string;
    refresh_token: string;
}

export interface UserData {
    id: number;
    username: string;
    email: string;
    registered_on: Date; // or maybe string ("Wednesday, 06 December 2017 12:15AM")
    confirmed: boolean;
    confirmed_on: Date | string;
    admin: boolean;
}

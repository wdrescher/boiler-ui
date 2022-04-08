import { Validators } from "@angular/forms";

export interface Country {
    name: string; 
    code: string; 
}

export interface InputControl {
    output: any;
    label: string;
    placeholder?: string;
    type: InputType;
}

export interface Paginator {
    offset: number; 
    limit: number;
}

export interface SettingItem {
    label: string;
    previousValue: any;
    formControlName: string; //link to value in settings interface
    validators: Validators[];
    type: string;
    options?: any[];
    errorCode: string;
    hideField?: boolean;
    httpField?: boolean;
    isCountry?: boolean;
    readOnly?: boolean; 
}

export enum InputType {
    TEXT = 'text',
    PASSWORD = 'password',
    EMAIL = 'email'
}

export interface Settings {
    temp:string; 
}

export interface User {
    profile_id: number;
    username: string; 
    email: string; 
    first_name: string; 
    last_name: string; 
    is_artist?: boolean; 
}

export interface Artist {
    max_bookings: number, 
    is_manager:	boolean
    minimum_price: number
    parlor_id: number
}

export interface Booking {
    artist_id: number,
    client_id: number,
    booking_id: number,
    design_description: string,
    design_approved: boolean,
    price: number,
    price_approved: boolean, 
    selected_date: Date; 
  }

export interface ArtistProfile extends User, Artist {}

export interface Client {
    payment_id: string; 
    contact_method: string;
}

export interface Parlor {
    parlor_id: number; 
    name: string; 
    address_line_1: string; 
    address_line_2: string; 
    city: string; 
    state: string; 
    zip: string; 
    shop_commission: number; 
}

export interface Artist {
    parlor_id: number; 
}

export enum AppState {
    LOGIN = '',
    SIGNUP = 'signup',
    GALLERY = 'gallery',
    EMAIL_VERIFICATION = 'verify',
    RESET_PASSWORD = 'reset-password',
    SET_PASSWORD = "set-password",
    FORGOT_PASSWORD = 'forgot-password',
    HOME = 'gallery',
    DETAIL = 'detail', 
    UPLOAD = "upload", 
    RESEND_EMAIL = "resend-email",
    SETUP = "setup", 
    PROFILE = 'profile',
    CURRENT_USER = 'user', 
    SETTINGS = "settings",
    ACCOUNT_SETTINGS = 'account',
    PASSWORD_SETTINGS = 'password', 
    BILLING_SETTINGS = 'billing', 
    ADDRESS_SETTINGS = 'address',
    BOOKINGS = "bookings",
    PARLORS = 'parlor'
}

export enum FileType { 
    IMG = "image", 
    VIDEO = "video",
    USER_DATA = "user_data",
}

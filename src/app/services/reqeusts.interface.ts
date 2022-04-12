export interface LoginRequest {
    username: string; 
    password: string; 
    client_id: string; 
    client_secret: string; 
    grant_type: string; 
    scope: string; 
}

export interface LoginSuccessResponse {
    status: string; 
    access_token: string; 
    token_type: string; 
}

export interface ErrorResponse {
    detail: string; 
}

export interface ValidateTokenRequest {
    email: string; 
    token: string; 
}

export interface ValidateTokenSuccessResponse {
    status: string; 
    email: string; 
}

export interface TokenValidationResponse {
    token: string;
}

export interface RegisterUserRequest {
    email: string; 
    password: string; 
    first_name: string; 
    last_name: string;
}

export interface GenerateTokenRequest {
    email: string;
}
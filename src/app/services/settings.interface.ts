export interface UpdateUserRequest {
    id_front_url?: string; 
    id_back_url?: string,
    first_name?: string; 
    last_name?: string; 
    country?: string;
    state_or_province?: string;
    city?: string; 
    street_address?: string; 
    street_address_line_2?: string;
    profile_image_content_id?: string; 
    twitter_url?: string; 
    instagram_url?: string;
    username?: string;
    bio?: string; 
    zip?: string;
}
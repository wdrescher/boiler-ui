import { InputControl } from 'src/app/app.interface';

export interface LandingPageConfig {
    title: string;
    buttonText: string;
    buttonAction: () => void;
    controls: InputControl[];
    secondaryButtonText?: string;
    secondaryButtonAction?: () => void;
    helperText?: string;
    helperTextAction?: () => void;
}

export enum LandingPageState {
    LOGIN = 'Login',
    SIGNUP = 'Signup',
    FORGOT_PASSWORD = 'Forgot Password',
    RESET_PASSWORD = 'Reset Password',
    EMAIL_VERIFICATION  = 'Email Verification', 
    SET_PASSWORD = "Set Password"
}

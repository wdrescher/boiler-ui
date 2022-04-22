import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';

import { LandingPageState } from './landing-page.interface';
import { AppState, User } from '../app.interface';
import { UserStateService } from '../services/user-state.service';
import { LoginSuccessResponse, TokenValidationResponse, ValidateTokenSuccessResponse } from '../services/reqeusts.interface';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AppStateService } from '../services/app-state.service';
import { AUTH_TOKEN_KEY, AWAITING_VERIFICATION_KEY, PASSWORD_LENGTH } from '../app.constants';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';

interface LandingPageConfig {
  color: string; 
  title: string; 
  buttonText: string; 
  secondaryButtonText: string; 
  message: string; 
}

@Component({
  selector: 'tattoo-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'], 
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS, 
      useValue: {
        required: 'Value required.', 
        email: 'Valid email addresses only.',
        minLength: ((context: {min: number}): string => `Enter ${context.min} characters or more.`),
      }
    }
  ]
})
export class LandingPageComponent implements OnInit {

  formGroup: FormGroup;
  loginError = '';
  isLoading = false;
  token = '';
  passwordResetMessage: string;
  private _pageSettings: {[label: string]: LandingPageConfig} = {
    Login: {
      color: 'blue',
      title: 'Login',
      buttonText: 'Login',
      secondaryButtonText: 'Sign up here.',
      message: 'Don\'t have an account?'
    },
    Signup: {
      color: 'blue',
      title: 'Sign Up',
      buttonText: 'Sign Up',
      secondaryButtonText: 'Login here.',
      message: 'Already have an account?'
    },
    'Forgot Password': {
      color: 'blue',
      title: 'Forgot Password',
      buttonText: 'Reset',
      secondaryButtonText: 'Login here.',
      message: 'Just remembered it?'
    },
    "Reset Password": {
      color: 'blue',
      title: 'Reset Password',
      buttonText: 'Reset',
      secondaryButtonText: 'Login here.',
      message: 'Just remebered it?'
    }, 
    "Set Password": {
      color: "blue", 
      title: "Set Password", 
      buttonText: "Set", 
      secondaryButtonText: "", 
      message: ""
    }
  };
  private _controlNameMapping: {[controlName: string]: string} = {
    username: 'Email',
    password: 'Password',
    confirmPassword: 'Matching Password',
  };
  private _pageState = LandingPageState.LOGIN;
  private _controlNames = [
    'username', 'password', 'confirmPassword'
  ];
  private _token: string;
  private _nextRoute: string;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router,
    private authService: AuthService,
    private _userStateService: UserStateService, 
    private _appState: AppStateService
  ) {}

  private _checkToken(): void {
    this.activatedRoute.paramMap.pipe(take(1)).subscribe(
      (response) => {
        if (response.has('token')) {
          let token = response.get('token');
          this.authService.validateToken(token).pipe(take(1)).subscribe(
            (res: TokenValidationResponse) => {
              // this._userStateService.tempLogin();
              this._userStateService.login(res.token);
              this.router.navigateByUrl(AppState.SET_PASSWORD);
            },
            () => {
              this._userStateService.tempLogin('');
              this.router.navigateByUrl(AppState.GALLERY)
            }
          )
        }
        else if (response.has('route')) {
          this._nextRoute = decodeURI(response.get('route'));
        }
      },
      (err) => {
      }
    );
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''], 
    });
    this._checkToken();
    this.activatedRoute.data.subscribe( param => {
      if (!!param.pageState){
        this.pageState = param.pageState;
      }
      else {
        this.pageState = LandingPageState.LOGIN;
      }
    });
  }

  private _login(token: string): void {
    this._userStateService.login(token);
    this.router.navigate([!this._nextRoute ? AppState.GALLERY : this._nextRoute]);
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.isLoading = true;
      if (this.isLogin) {
        
        this.loginError = '';
        const username = this.formGroup.controls.username.value.toLowerCase();
        const password = this.formGroup.controls.password.value;
        this.authService.attemptLogin(username, password)
        .pipe(take(1))
        .subscribe(
          (response: LoginSuccessResponse) => {
            this.isLoading = false;
            this._login(response.access_token);
          },
          (response) => {
            this.isLoading = false;
            this.formGroup.controls['password'].setValue('');
            this.formGroup.controls['password'].reset();
            if (response.error && response.error && response.error.detail) {
              this.loginError = "That username and password didn't work, please try again"
            }
            else {
              this._appState.displayErrorModal = true; 
              this.loginError = "Whoops, something went wrong"
            }
          }
        );
      }
      else if (this.isSignup) {
        
        const controls = this.formGroup.controls;
        let username = controls["username"].value; 
        let password = controls["password"].value;
        this.authService.registerUser(
          username.toString().toLowerCase(),
          password, 
          '', 
          'last_name'
        )
        .pipe(take(1))
        .subscribe(
          () => {
            
            this.authService.attemptLogin(username, password)
            .pipe(take(1))
            .subscribe(
              (response: LoginSuccessResponse) => {
                this.isLoading = false;
                this._login(response.access_token);
              }
            )
          },
          (response: HttpErrorResponse) => {
            if (response.status === 409) {
              this._userStateService.tempLogin(username); 
              this.router.navigateByUrl(AppState.GALLERY); 
              return; 
            }

            if (!!response.error && !!response.error.detail) {
              this.loginError = response.error.detail;
            }
            else {
              this._appState.displayErrorModal = true; 
              this.loginError = "whoops something must have gone wrong"
            }
            this.isLoading = false;
          }
        )
      }
      else if (this.pageState === LandingPageState.FORGOT_PASSWORD) {
        
        const email = this.formGroup.controls.username.value;
        this.authService.forgotPassword(email)
          .pipe(take(1))
          .subscribe(
            () => {
              this.passwordResetMessage = "Check your email for a password reset link";
              this.isLoading = false;
              this._pageSettings[this._pageState].buttonText = "&#x2714;"
            },
            (response: HttpErrorResponse) => {
              this.isLoading = false;
              if (!!response.error && !!response.error.detail) {
                this.loginError = response.error.detail;
              }
            }
          )
      }
      else if (this.pageState === LandingPageState.RESET_PASSWORD) {
        
        const password = this.formGroup.controls.password.value;
        // this.authService.resetPassword(this._token, password)
        //   .pipe(take(1))
        //   .subscribe(
        //     () => {
        //       this.router.navigateByUrl("login")
        //     },
        //     (response) => {
        //       this.isLoading = false;
        //       if (response.error && response.error.password) {
        //         this.loginError = response.error.password[0];
        //       }
        //       else {
        //         Sentry.captureException(response);
        //         this.modal.open();
        //       }
        //     }
        //   )
      }
      else if (this.pageState === LandingPageState.SET_PASSWORD) {
        
        let password = this.formGroup.controls["password"].value; 
        let email = this.cookieService.get(AWAITING_VERIFICATION_KEY);
        this.authService.setPassword(password)
          .pipe(take(1))
          .subscribe(
            () => {
              this.router.navigateByUrl(AppState.GALLERY);
              // this._userStateService.loadUser(res);
              // this.authService.attemptLogin(email, password).subscribe(
              //   (res: LoginSuccessResponse) => {
              //     this._login(res.access_token);
              //     this.router.navigateByUrl(AppState.GALLERY);
              //   }
              // )
            }, 
            (err: HttpErrorResponse) => {
              this.loginError = err.error.detail; 
              this.isLoading = false; 
            }, 
            () => {
              this.isLoading = false; 
            }
          )
      }
    }
  }

  toggleState(): void {
    this.isLogin ? this.router.navigateByUrl(AppState.SIGNUP) : this.router.navigateByUrl(AppState.LOGIN);
  }

  forgotPassword(): void {
    this.router.navigateByUrl(AppState.FORGOT_PASSWORD);
  }

  isInvalid(formControlName): boolean {
    const control = this.formGroup.controls[formControlName];
    if (formControlName === 'confirmPassword' && (control.dirty || control.touched)) {
      return control.value !== this.formGroup.controls.password.value;
    }
    return (control.dirty || control.touched) && control.invalid;
  }

  get isLogin(): boolean {
    return this._pageState === LandingPageState.LOGIN;
  }

  get isSignup(): boolean {
    return this._pageState === LandingPageState.SIGNUP;
  }

  get isForgotPassword(): boolean {
    return this._pageState === LandingPageState.FORGOT_PASSWORD;
  }

  get isReset(): boolean {
    return this._pageState === LandingPageState.RESET_PASSWORD;
  }

  get isSetPassword(): boolean {
    return this.pageState === LandingPageState.SET_PASSWORD; 
  }

  set pageState(state: LandingPageState) {
    this._pageState = state;
    switch (state) {
      case LandingPageState.LOGIN:
        this.formGroup.controls.confirmPassword.clearValidators();
        this.formGroup.controls.password.setValidators([Validators.required, Validators.minLength(PASSWORD_LENGTH)]);
        break;
      case LandingPageState.SET_PASSWORD:
        this.formGroup.controls.username.clearValidators();
        this.formGroup.controls.confirmPassword.setValidators(LandingPageComponent.matchValues("password"));
        this.formGroup.controls.password.setValidators([Validators.required, Validators.minLength(PASSWORD_LENGTH)]);
      case LandingPageState.RESET_PASSWORD:
        this.formGroup.controls.confirmPassword.setValidators(LandingPageComponent.matchValues("password"));
        this.formGroup.controls.password.setValidators([Validators.required, Validators.minLength(PASSWORD_LENGTH)]);
        return;
      case LandingPageState.SIGNUP:
        this.formGroup.controls.confirmPassword.setValidators(LandingPageComponent.matchValues("password"));
        this.formGroup.controls.password.setValidators([Validators.required, Validators.minLength(PASSWORD_LENGTH)]);
      default:
        return;
    }
  }

  get pageState(): LandingPageState {
    return this._pageState;
  }

  get config(): LandingPageConfig {
    return this._pageSettings[this.pageState];
  }

  public static matchValues(
    matchTo: string // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { other: "Passwords do not match." };
    };
  }
}

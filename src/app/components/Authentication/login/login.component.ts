import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../core/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _AuthenticationService: AuthenticationService = inject(AuthenticationService);
  private readonly _Router: Router = inject(Router);
  private readonly _ToastrService: ToastrService = inject(ToastrService);
  private readonly grant_type: string = environment.grant_type;
  private readonly mobileid: string = environment.mobileid;
  isLoading: boolean = false;
  loginForm : FormGroup = this.formBuilder.group({
    username: [null, [Validators.required]],
    Password: [null, [Validators.required]]
  })


  submitLogin(): void
  {
    if(!this.loginForm.valid) return;
    this.isLoading = true;
    const loginData: HttpParams = new HttpParams()
    .set("username", this.loginForm.value.username)
    .set("Password", this.loginForm.value.Password)
    .set("grant_type", this.grant_type)
    .set("mobileid", this.mobileid);

    this._AuthenticationService.getToken(loginData.toString()).subscribe({
      next: res => {
        this.isLoading = false;
        if(isPlatformBrowser(this._PLATFORM_ID))
        {
          localStorage.setItem("userToken", res.access_token)
        }
        this._Router.navigate(["/Home"])
      },
      error: err => {
        this.isLoading = false;
        this._ToastrService.error(`Something went wrong while sign in!`, "ERROR")
        console.log(err);
      }
    })
  }
}

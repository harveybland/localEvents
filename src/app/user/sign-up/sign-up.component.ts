import { JwtStorageService } from './../../core/service/jwt-storage.service';
import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  email = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  password = new FormControl('', [
    Validators.required
  ]);

  signUpForm: FormGroup = new FormGroup({
    email: this.email,
    password: this.password
  });

  showSucessMessage: boolean;
  serverErrorMessages: string;

  constructor(private _userService: UserService,
    private _jwtService: JwtStorageService,
    public _router: Router
  ) { }

  ngOnInit() {
    if (this._jwtService.isLoggedIn()) {
      this._router.navigateByUrl('/ui/profile');
    }
  }

  onSubmit() {
    let model = this.userModel();
    this._userService.create(model).subscribe(res => {
      return this._userService.login(model).subscribe(res => {
        this._jwtService.setToken(res['token']);
        this._router.navigateByUrl('/ui/profile');
      })
    },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = 'Something went wrong.Please contact admin.';
      })
  }

  userModel() {
    return {
      email: this.signUpForm.controls.email.value,
      password: this.signUpForm.controls.password.value,
    }
  }

}

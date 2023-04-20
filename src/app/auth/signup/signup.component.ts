import { NgForm } from '@angular/forms';
import { AuthService } from './../auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  isLoading = false;
  constructor(public authService: AuthService) {}

  OnSignUp(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}

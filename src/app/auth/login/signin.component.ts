import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SignInComponent {
  isLoading: boolean = false;
  constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
    console.log(form.value.password, form.value.email);
    this.isLoading = true;
    if (form.invalid) return;

    this.authService.login(form.value.email, form.value.password);
  }
}

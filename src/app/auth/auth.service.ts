import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface AuthData {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string = '';
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password,
    };

    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((result) => this.router.navigate(['/signin']));
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password,
    };
    this.http
      .post<{ token: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe((result) => {
        const token = result?.token;
        this.token = token;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      });
  }
}

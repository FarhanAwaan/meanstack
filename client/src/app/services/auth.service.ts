import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: Http) { }

  registerUser(user) {
    const customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/register', user, { headers: customHeaders } ).map(res => res.json() );
  }

  authenticateUser(user) {
    const customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/authenticate', user, { headers: customHeaders } ).map(res => res.json() );
  }

  getProfile() {
    const customHeaders = new Headers();
    this.loadToken();
    customHeaders.append('Authorization', this.authToken);
    customHeaders.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/users/profile', { headers: customHeaders } ).map(res => res.json() );
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loggedIn() {
    const isUserLoggedIn = localStorage.getItem('id_token');
    return isUserLoggedIn == null ? false : true;
  }

  logOut() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}

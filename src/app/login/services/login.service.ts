import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginURL: string = 'http://localhost:3040/login'

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  login(username: string, password: string): Observable<any> {
    const credentials = {username, password}
    return this.http.post(this.loginURL, credentials)
  }

  saveToken(token: string) {
    this.cookieService.set('access_token', token)
  }

  getToken(): string {
    return this.cookieService.get('access_token')
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  logout() {
    this.cookieService.delete('access_token')
  }

  
}

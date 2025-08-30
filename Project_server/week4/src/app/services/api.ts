import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse
{
  message: string;
  success : boolean;
  details:string;
  token : string;
}



@Injectable({
  providedIn: 'root'
})
export class Api {
    constructor(private http: HttpClient) {}
    private baseUrl = 'http://localhost:3000/api';
    // private baseUrl = 'http://121.222.65.60:3000/api';

    loginRequest(user: {username: string; password: string})
    {
      return this.http.post<LoginResponse>(`${this.baseUrl}/auth`, user);
    }

    createAccountRequest(user: {username: string; password: string})
    {
      return this.http.post<LoginResponse>(`${this.baseUrl}/create`, user)
    }

    ping(): Observable<any>
    {
      return this.http.get(`${this.baseUrl}/ping`);
    }

    verifyToken(token: string) 
    {
      console.log(token);
      return this.http.post<{ valid: boolean, username: string, email: string, age: string, birthdate: string }>(`${this.baseUrl}/verifyToken`,null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
}

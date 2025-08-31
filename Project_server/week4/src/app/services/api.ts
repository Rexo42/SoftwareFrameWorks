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
      return this.http.post<{success: boolean, token: string}>(`${this.baseUrl}/auth`, user);
    }

    createAccountRequest(user: {username: string; password: string})
    {
      return this.http.post<{success: boolean, token : string, message : string}>(`${this.baseUrl}/create`, user)
    }

    updateProfileRequest(user: {username: string; email: string; age: string; birthdate: string}, token:string)
    {
      return this.http.post<{success: boolean}>(`${this.baseUrl}/updateProfile`, user, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
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

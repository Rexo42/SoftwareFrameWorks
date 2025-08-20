import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface LoginResponse
{
  message: string;
  success : boolean;
  details:string;
}



@Injectable({
  providedIn: 'root'
})
export class Api {
    constructor(private http: HttpClient) {}
    private baseUrl = 'http://localhost:3000/api';

    loginRequest(user: {username: string; password: string})
    {
      return this.http.post<LoginResponse>(`${this.baseUrl}/auth`, user);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


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
      return this.http.patch<{success: boolean, message:string}>(`${this.baseUrl}/update`, user, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }

    createGroup(token: string, groupName: string, username: string)
    {
      return this.http.post<{ valid: boolean}>(`${this.baseUrl}/createGroup`,({groupName: groupName, username: username}), {
      headers: {
      Authorization: `Bearer ${token}`
      }
      });
    }

    getGroups(token : string)
    {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<{groups: string[]}>(`${this.baseUrl}/getGroups`, { headers });
    }
  

    verifyToken(token: string) 
    {

      //console.log(token);
      return this.http.post<{ valid: boolean, username: string, email: string, age: string, birthdate: string }>(`${this.baseUrl}/verify`,null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
}

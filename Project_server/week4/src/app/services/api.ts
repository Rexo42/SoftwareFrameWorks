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
    deleteUserRequest(userID : string, username : string)
    {
      return this.http.delete<{success: boolean, message: string}>(`${this.baseUrl}/delete/${username}`)
    }

    getUsersRequest(page: number, limit: number)
    {
      return this.http.get<{success: boolean, users: string[], ids: string[], roles: string[], pageLimit: number}>(`${this.baseUrl}/getUsers`, {
        params: {
          page: page.toString(),
          limit: limit.toString(),
        }
      })
    }
    updateUserRole(username : string, role: string)
    {
      const roleObject = {role};
      return this.http.patch<{success: boolean, message:string}>(`${this.baseUrl}/updateRole/${username}`,roleObject);
    }

    createGroup(groupName: string, username: string)
    {
      return this.http.post<{ valid: boolean}>(`${this.baseUrl}/createGroup`,({groupName: groupName, username: username}), {});
    }

    getGroups(page: number, limit: number, username: string)
    {
      // const headers = new HttpHeaders({
      //   'Authorization': `Bearer ${token}`
      // });
      return this.http.get<{success: boolean, groups: string[], ids: string[], creators: string[], pageLimit: number}>(`${this.baseUrl}/getGroups`, {
        params: {
          page: page.toString(),
          limit: limit.toString(),
          username: username.toString(),
        }

      });
    }

    deleteGroup(groupName: string)
    {
      return this.http.delete<{success: boolean, message: string}>(`${this.baseUrl}/deleteGroup/${groupName}`);
    }

    createChannel(username: string, groupName: string, channelName: string)
    {
      return this.http.post<{ valid: boolean}>(`${this.baseUrl}/createChannel`,({username: username, groupName: groupName, channelName: channelName}), {});
    }
  

    verifyToken(token: string) 
    {
      return this.http.post<{ valid: boolean, role: string, username: string, email: string, age: string, birthdate: string }>(`${this.baseUrl}/verify`,null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
}

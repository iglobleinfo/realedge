import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  CLIENT_ID = environment.CLIENT_ID;
  CLIENT_SECRET = environment.CLIENT_SECRET;
  API_URL = environment.API_URL;
  constructor(private http: HttpClient, private sharedService: SharedService) { }

  public doLogin(username:any, password:any) {
    console.log(username)
    // var data = { "grant_type": "password", "client_id": "iotasmart", "client_secret": "iotasmart-auth", "username": username, "password": password };
    let body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    console.log(username);
    console.log(password)
    body.set('client_id', this.CLIENT_ID);
    body.set("client_secret", this.CLIENT_SECRET);
    body.set("grant_type", "password");


    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded;'
    );

    return this.http.post(this.API_URL + "/authservice/v1/oauth/token", body, { headers: headers });
  }

  getUserContext(userId: any, access_token: any) {
    let options = { headers: new HttpHeaders().set('token', access_token) }
    let url = `${this.API_URL}/userdeviceservice/v1/user/context/${userId}`;
    return this.http.get(url, options);
  }
}

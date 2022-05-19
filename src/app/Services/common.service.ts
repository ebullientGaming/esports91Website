import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(public http: HttpClient) { }

  postWitoutAuthService(value, url) {
    return this.http.post(url, value);
  }
  post(value, url) {

    let auth = localStorage.getItem('authGame');
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': auth
      })
    };
    return this.http.post(url, value,httpOptions);
  }

  post2(value, url){
    let auth = localStorage.getItem('authGame');
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': auth,
      })
    };
    return this.http.post(url, value, httpOptions);
  }

  getWitoutAuthService(url) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(url, httpOptions);
  }

  get(url) {

    let auth = localStorage.getItem('authGame');
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': auth
      })
    };
    return this.http.get(url, httpOptions);
  } 
  
  getFeedBack(){
    var myHeaders = new Headers();
    let auth = localStorage.getItem('authGame');
    myHeaders.append("Authorization", auth);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"feedback":"asv"});

    var requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    return fetch("http://159.65.148.113/user_logs/set_feedback", requestOptions);
  }
}

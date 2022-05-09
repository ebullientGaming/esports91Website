import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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

    fetch("http://159.65.148.113/user_logs/set_feedback", requestOptions)
      //.then(response => console.log(response.text()))
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
      }

}

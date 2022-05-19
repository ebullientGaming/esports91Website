import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { CommonService } from 'src/app/Services/common.service';
import { interval } from 'rxjs';
@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss'],
})
export class LoginPopupComponent implements OnInit {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  active = false;
  saving = false;
  loginValue: string = '';
  otp: any;
  isSendOtp = false;
  eventTYpe: any = '';
  count = 59;
  subcribeInterval: any;
  interval: any;
  isSendbuttonDisable = false;
  @Output() loadDataEvent = new EventEmitter<any>();
  constructor(
    private common: CommonService,
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.interval = interval(1000);
  }
  onOtpChange(otp: string) {
    this.otp = otp;

    if(this.otp.length === 4){
      this.login();
    }
  }
  show(type?: any): void {
    this.eventTYpe = type;
    this.modal.show();
  }
  save() {
    if(!this.loginValue){
      this.toastr.error('Mobile Number can not be empty.', 'Error');
      return;
    }
    let regex =  /^(\+\d{1,3}[- ]?)?\d{10}$/g;
    if(!this.loginValue.match(regex)) {
      this.toastr.error('Mobile Number is invalid.', 'Error');
      return;
    }
    this.loginRequest();
    this.countTimer();
  }

  loginRequest() {
    let url = this.api.loginRequest;
    let formdata = JSON.stringify({
      phone_number: '+91' + this.loginValue,
    });
    this.common.postWitoutAuthService(formdata, url).subscribe(
      (res) => {
        this.isSendOtp = true;
      },
      (err) => {
        //this.loader = false;
      }
    );
  }

  login() {
    let url = this.api.login;
    let formdata = JSON.stringify({
      phone_number: '+91' + this.loginValue,
      otp: this.otp,
      device_id: 'asdasd',
    });
    this.common.postWitoutAuthService(formdata, url).subscribe(
      (res) => {
        if (res['success']) {
          localStorage.setItem('authGame', res['data'].authorization);
          this.modal.hide();
          this.getUserDetails();
          this.loadDataEvent.emit();
        } else {
          this.toastr.error(res['message'], 'Error');
        }
      },
      (err) => {
        //this.loader = false;
      }
    );
  }

  getUserDetails() {
    let url = this.api.get_profile;
    this.common.get(url).subscribe(
      (res) => {
      },
      (err) => {
        //this.loader = false;
      }
    );
  }

  countTimer() {
    this.isSendbuttonDisable = true;
    this.subcribeInterval = this.interval.subscribe((val) => {
      this.count--;
      if (this.count == -1) {
        this.isSendbuttonDisable = false;
        this.subcribeInterval.unsubscribe();
        this.count = 59;
      }
    });
  }

  close() {}
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/authGuard/auth.service';
import { CommonService } from 'src/app/Services/common.service';
import { LoaderService } from '../loader/loader.service';
import { LoginPopupComponent } from '../login-popup/login-popup.component';

class ProfileDetails {
  device_id?: any;
  first_name?: any;
  last_name?: any;
  device_type?: any;
  dob?: any;
  email: any;
  email_verified?: any;
  gender?: any;
  id: any;
  is_active: any;
  last_login?: any;
  linked_tree?: any;
  phone_number: any;
  phone_number_verified?: any;
  profile_pic: any;
  status: any;
}

@Component({
  selector: 'app-nab-bar',
  templateUrl: './nab-bar.component.html',
  styleUrls: ['./nab-bar.component.scss'],
})
export class NabBarComponent implements OnInit {
  @ViewChild('loginPopup', { static: true }) loginPopup: LoginPopupComponent;
  searchValue: any;
  authData: any;
  profileDetails: ProfileDetails = new ProfileDetails();
  constructor(
    public loader: LoaderService,
    private _router: Router,
    private toastr: ToastrService,
    private auth: AuthService,
    private api: ApiService,
    private common: CommonService
  ) {}

  ngOnInit(): void {
    this.authData = this.auth.isAuthenticated();
    this.getUserDetails();
  }
  searchValueRedirect() {
    this._router.navigate(['/search', { search: this.searchValue }]);
  }
  logOut() {
    localStorage.removeItem('authGame');
    this.toastr.success('logout successfully');
    this.authData = false;
    this.refresh();
    this._router.navigate(['/']);
  }
  refresh(): void {
    window.location.reload();
  }
  goToProfile() {
    this._router.navigate(['/profile']);
  }
  goToPrivacy() {
    this._router.navigate(['/privacy']);
  }
  getUserDetails() {
    let url = this.api.get_profile;
    this.common.get(url).subscribe(
      (res) => {
        if (res['success']) {
          this.profileDetails = res['data'];
        } else if (!res['success'] && res['message'] == 'Anauthorized access') {
          this.logOut();
        }
      },
      (err) => {
        //this.loader = false;
      }
    );
  }
  getImageUrl(imageUrl) {
    if (imageUrl) {
      return 'http://159.65.148.113/media/' + imageUrl;
    } else {
      return 'assets/images/home/dp_placeholder.png';
    }
  }
  loadData() {
    this.refresh();
  }
  logIn() {
    this.loginPopup.show('Home');
  }
}

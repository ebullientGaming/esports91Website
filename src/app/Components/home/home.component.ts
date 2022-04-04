import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { CommonService } from 'src/app/Services/common.service';
import { LoginPopupComponent } from '../login-popup/login-popup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('loginPopup', { static: true }) loginPopup: LoginPopupComponent;
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  chartArr: any;
  templateTypeSelected: any;
  items = [1, 2, 3, 4, 5, 6, 7, 8];
  trendingPlayer: any = [];
  trendingTeam: any = [];
  voteDetails: any;
  loader: boolean;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTrendingPLayerData();
    this.getTrendingTeams();
    this.getUserDetails();
    this.getVoteDetails();
    this.getImageValue();
  }

  getImageValue() {
    this.chartArr = [
      {
        name: 'pubg',
        url: '/assets/images/icons/pubg',
      },
      {
        name: 'cod',
        url: '/assets/images/icons/csgo',
      },
      {
        name: 'csgo',
        url: '/assets/images/icons/cod',
      },
      {
        name: 'extra',
        url: '/assets/images/icons/last',
      },
    ];
  }

  getDataByTemplate(val, i) {
    //for future implmentations
  }
  upVote(type, id) {
    let auth = localStorage.getItem('authGame');
    if (!auth) {
      this.loginPopup.show('Home');
    } else {
      var upVoteCount = '1';
      if (
        this.voteDetails &&
        this.voteDetails[0] &&
        this.voteDetails[0]?.votes_player[id] &&
        this.voteDetails[0]?.votes_player[id] == 1
      ) {
        upVoteCount = '0';
      }
      if (
        this.voteDetails &&
        this.voteDetails[0] &&
        this.voteDetails[0]?.votes_teams[id] &&
        this.voteDetails[0]?.votes_teams[id] == 1
      ) {
        upVoteCount = '0';
      }
      var raw = JSON.stringify({
        type: type,
        object_id: id.toString(),
        vote_count: upVoteCount,
      });
      //get data from backend
      let url = this.api.vote;
      this.common.post(raw, url).subscribe(
        (res) => {

          if (res['success']) {
            if (type == 'team') {
              this.getVoteDetails();
              this.getTrendingTeams();
            } else if (type == 'player') {
              this.getVoteDetails();
              this.getTrendingPLayerData();
            }
          } else {
            this.toastr.error(res['message']);
          }
        },
        (err) => {
          //this.loader = false;
        }
      );
    }
  }

  downVote(type, id) {
    let auth = localStorage.getItem('authGame');
    if (!auth) {
      this.loginPopup.show('Home');
    } else {
      var downVoteCount = '-1';
      if (
        this.voteDetails &&
        this.voteDetails[0] &&
        this.voteDetails[0]?.votes_player[id] &&
        this.voteDetails[0]?.votes_player[id] == -1
      ) {
        downVoteCount = '0';
      }
      if (
        this.voteDetails &&
        this.voteDetails[0] &&
        this.voteDetails[0]?.votes_teams[id] &&
        this.voteDetails[0]?.votes_teams[id] == -1
      ) {
        downVoteCount = '0';
      }
      var raw = JSON.stringify({
        type: type,
        object_id: id.toString(),
        vote_count: downVoteCount,
      });
      //get data from backend
      let url = this.api.vote;
      this.common.post(raw, url).subscribe(
        (res) => {
          if (res['success']) {
            if (type == 'team') {
              this.getVoteDetails();
              this.getTrendingTeams();
            } else if (type == 'player') {
              this.getVoteDetails();
              this.getTrendingPLayerData();
            }
          } else {
            this.toastr.error(res['message']);
          }
        },
        (err) => {
          //this.loader = false;
        }
      );
    }
  }

  getTrendingPLayerData() {
    //get data from backend
    this.loader = true;
    let url = this.api.trending_players;
    this.common.getWitoutAuthService(url).subscribe(
      (res) => {
        this.loader = false;
        this.trendingPlayer = res['data'];
      },
      (err) => {
        this.loader = false;
      }
    );
  }
  getTrendingTeams() {
    //get data from backend
    let url = this.api.trending_teams;
    this.loader = true;
    this.common.getWitoutAuthService(url).subscribe(
      (res) => {
        this.loader = false;
        this.trendingTeam = res['data'];
      },
      (err) => {
        this.loader = false;
      }
    );
  }
  getImageUrl(imageUrl) {
    if (imageUrl) {
      return 'http://159.65.148.113/media/' + imageUrl;
    } else {
      return 'assets/images/home/sample_player.png';
    }
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
  getVoteDetails() {
    let getVoteUrl = this.api.get_voting_data;
    this.common.get(getVoteUrl).subscribe(
      (res) => {
        this.voteDetails = res['data'];
      },
      (err) => {
        //this.loader = false;
      }
    );
  }
  getUpVoteClass(type, id) {
    if (type == 'player') {
      if (this.voteDetails && this.voteDetails[0]) {
        let playerVote = this.voteDetails[0]?.votes_player[id];
        if (playerVote && playerVote == 1) {
          return 'upVoteActive';
        } else {
          return 'upVote';
        }
      } else {
        return 'upVote';
      }
    } else if (type == 'team') {
      if (this.voteDetails && this.voteDetails[0]) {
        let teamVote = this.voteDetails[0]?.votes_teams[id];
        if (teamVote && teamVote == 1) {
          return 'upVoteActive';
        } else {
          return 'upVote';
        }
      } else {
        return 'upVote';
      }
    }
  }
  getDownVoteClass(type, id) {
    if (type == 'player') {
      if (this.voteDetails && this.voteDetails[0]) {
        let playerVote = this.voteDetails[0]?.votes_player[id];
        if (playerVote && playerVote == -1) {
          return 'downVoteActive';
        } else {
          return 'downVote';
        }
      } else {
        return 'downVote';
      }
    } else if (type == 'team') {
      if (this.voteDetails && this.voteDetails[0]) {
        let teamVote = this.voteDetails[0]?.votes_teams[id];
        if (teamVote && teamVote == -1) {
          return 'downVoteActive';
        } else {
          return 'downVote';
        }
      } else {
        return 'downVote';
      }
    }
  }
  loadData() {
    this.getVoteDetails();
    this.refresh();
  }
  refresh(): void {
    window.location.reload();
  }
  getClassName(src) {
    if (
      src == '/assets/images/icons/cod' ||
      src == '/assets/images/icons/cod_white'
    ) {
      return 'codImg';
    } else if (
      src == '/assets/images/icons/csgo' ||
      src == '/assets/images/icons/csgo_white'
    ) {
      return 'csgoImg';
    } else if (
      src == '/assets/images/icons/pubg' ||
      src == '/assets/images/icons/pubg_white'
    ) {
      return 'pubgImg';
    } else if (
      src == '/assets/images/icons/last' ||
      src == '/assets/images/icons/last_white'
    ) {
      return 'lastImg';
    }
  }
  gotoPlayers(user) {
    this.router.navigate(['/playerDetails'], { queryParams: { id: user.id } });
  }
  gotoTeams(user) {
    this.router.navigate(['/teamDetails'], { queryParams: { id: user.id } });
  }
  gotoNews() {
    this.router.navigate(['/news']);
  }
  goToProfile() {
    this.router.navigate(['/profile']);
  }
}

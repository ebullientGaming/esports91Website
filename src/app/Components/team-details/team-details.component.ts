import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { CommonService } from 'src/app/Services/common.service';
import { LoginPopupComponent } from '../login-popup/login-popup.component';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss'],
})
export class TeamDetailsComponent implements OnInit {
  @ViewChild('loginPopup', { static: true }) loginPopup: LoginPopupComponent;
  panelOpenState = false;
  teamId = 0;
  pos = 1;
  teamDetails: any;
  sampleUserPlaceholderImages: any = 'assets/images/icons/user_placeholder.png';
  playerDetails: any;
  trendingPlayer: any = [];
  trendingTeam: any = [];
  voteDetails: any;
  youtubeLink: string;
  instaLink: string;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private _activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.teamId = this._activatedRoute.snapshot.queryParams['id'];
    this.pos = this._activatedRoute.snapshot.queryParams['pos'];
    this.getTeamDetails();
    this.getVoteDetails();
  }

  getTeamDetails() {
    let url = this.api.get_team;
    this.common.getWitoutAuthService(`${url}${this.teamId}`).subscribe(
      (res) => {
        this.teamDetails = res['data'];
        if(this.teamDetails?.social_links){
          let links = this.teamDetails?.social_links.split(",");
          const youtubeReg = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/g;
          const instaReg = /instagram/g;
          links.forEach(element => {
            if(element.match(youtubeReg)) {
              this.youtubeLink = element.trim();
            }
            if(element.match(instaReg)) { 
              this.instaLink = element.trim();
            }
          });
        }
      },
      (err) => {}
    );
  }

  getTrendingPLayerData() {
    // get data from backend
    let url = this.api.trending_teams;
    this.common.getWitoutAuthService(url).subscribe(
      (res) => {
        this.trendingTeam = res['data'];
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
      return 'assets/images/home/sample_player.png';
    }
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
        return 'downVote';
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
    //return "";
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
              this.getTeamDetails();
              this.getVoteDetails();
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
              this.getTeamDetails();
              this.getVoteDetails();
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
    //return "";
  }
  loadData() {
    this.getVoteDetails();
    this.refresh();
  }
  refresh(): void {
    window.location.reload();
  }
}

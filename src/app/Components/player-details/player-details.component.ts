import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { CommonService } from 'src/app/Services/common.service';
import { LoginPopupComponent } from '../login-popup/login-popup.component';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss'],
})
export class PlayerDetailsComponent implements OnInit {
  @ViewChild('loginPopup', { static: true }) loginPopup: LoginPopupComponent;
  panelOpenState = false;
  playerId = 0;
  pos = 1;
  playerDetails: any;
  trendingPlayer: any = [];
  trendingTeam: any = [];
  voteDetails: any;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private _activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.playerId = this._activatedRoute.snapshot.queryParams['id'];
    this.pos = this._activatedRoute.snapshot.queryParams['pos'];
    this.getPlayerDetails();
    this.getVoteDetails();
  }
  getPlayerDetails() {
    let url = this.api.get_player;
    this.common.getWitoutAuthService(`${url}${this.playerId}`).subscribe(
      (res) => {
        this.playerDetails = res['data'];
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
            } else if (type == 'player') {
              this.getVoteDetails();
              this.getPlayerDetails();
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
            } else if (type == 'player') {
              this.getVoteDetails();
              this.getTrendingPLayerData();
              this.getPlayerDetails();
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
  }
  getTrendingPLayerData() {
    //get data from backend
    let url = this.api.trending_players;
    this.common.getWitoutAuthService(url).subscribe(
      (res) => {
        this.trendingPlayer = res['data'];
      },
      (err) => {
        //this.loader = false;
      }
    );
  }

  loadData() {
    this.getVoteDetails();
    this.refresh();
  }
  refresh(): void {
    window.location.reload();
  }

  ClicklessMore() {
    var dots = document.getElementById('dots');
    var moreText = document.getElementById('more');
    var btnText = document.getElementById('BtnlessMore');

    if (dots.style.display === 'none') {
      dots.style.display = 'inline';
      btnText.innerHTML = 'Show more';
      moreText.style.display = 'none';
    } else {
      dots.style.display = 'none';
      btnText.innerHTML = 'Show less';
      moreText.style.display = 'inline';
    }
  }
}

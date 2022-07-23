import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { CommonService } from 'src/app/Services/common.service';
import { LoginPopupComponent } from '../login-popup/login-popup.component';

@Component({
  selector: 'app-tournament-details',
  templateUrl: './tournament-details.component.html',
  styleUrls: ['./tournament-details.component.scss']
})
export class TournamentDetailsComponent implements OnInit {
  @ViewChild('loginPopup', { static: true }) loginPopup: LoginPopupComponent;
  panelOpenState = false;
  tournanentId = 0;
  game_type : any;
  teamDetails: any;
  tournamentMatches:any;
  sampleUserPlaceholderImages: any = 'assets/images/icons/user_placeholder.png';
  playerDetails: any;
  trendingPlayer: any = [];
  trendingTeam: any = [];
  tournamentTeams:any = [];
  voteDetails: any;
  youtubeLink: string;
  instaLink: string;
  constructor(private api: ApiService,
    private common: CommonService,
    private _activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.tournanentId = this._activatedRoute.snapshot.queryParams['tournament_id'];
    this.game_type = this._activatedRoute.snapshot.queryParams['game_type'];
    this.getTournamentTeams();
    this.getTournamentMatchs();
    this.getVoteDetails();
    this.getTrendingPLayerData();
  }

  getTournamentTeams() {
    let url = this.api.get_tournament_teams;
    this.common.getWitoutAuthService(`${url}?game_type=${this.game_type}&tournament_id=${this.tournanentId}`).subscribe(
      (res) => {
        this.tournamentTeams = res['data'];
      },
      (err) => {}
    );
  }

  getTournamentMatchs() {
    let url = this.api.get_tournament_matches;
    this.common.getWitoutAuthService(`${url}?game_type=${this.game_type}&tournament_id=${this.tournanentId}`).subscribe(
      (res) => {
        this.tournamentMatches = res['data'];
        console.log("this.tournamentMatches", this.tournamentMatches);
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

  getTemasBgUrl(imageUrl) {
    if (imageUrl) {
      return 'http://159.65.148.113/media/' + imageUrl;
    } else {
      return 'assets/images/home/tournamnet_team_bg.png';
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
              //this.getTeamDetails();
              this.getTournamentTeams();
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
              //this.getTeamDetails();
              this.getTournamentTeams();
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
  gotoTeams(user, pos) {
    let finalPos = pos + 1;
    let length = finalPos.toString().length;
    if (length < 2) {
      finalPos = '0' + finalPos;
    }
    this.router.navigate(['/teamDetails'], {
      queryParams: { id: user.team__id, pos: finalPos },
    });
  }

}

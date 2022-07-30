import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { CommonService } from 'src/app/Services/common.service';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
declare var $: any;
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
  tournamentData: any;
  pointTableData: any[];
  pointTableTeamsData: any[];
  currentMatch: string;
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
    this.getTournamentData();
    this.getPoitTable();
  }

  getPoitTable(){
    this.pointTableData = [
      {
      name: "Hydra",
      kills: 1,
      placement: 1,
      mr: 12,
      pts:12,
      players:[{name: "Dynamo",
      kills: 1,
      placement: 1,
      mr: 12,
      pts:12},
      {name: "Dynamo",
      kills: 1,
      placement: 1,
      mr: 12,
      pts:12}]
    },
    {
      name: "Soul",
      kills: 1,
      placement: 1,
      mr: 12,
      pts:12,
      players:[{name: "Dynamo",
      kills: 1,
      placement: 1,
      mr: 12,
      pts:12},
      {name: "Dynamo",
      kills: 1,
      placement: 1,
      mr: 12,
      pts:12}]
    }
  ];
  }

  getTournamentData() {
    //get data from backend
    let url = `${this.api.tournaments}/?id=${this.tournanentId}`;
    this.common.getWitoutAuthService(url).subscribe(
      (res) => {
        this.tournamentData = res['data'][0];
        console.log("this.tournamentData", this.tournamentData);
      },
      (err) => {
        //this.loader = false;
      }
    );
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

  getImageUrlTeam(imageUrl) {
    if (imageUrl) {
      return 'http://159.65.148.113/' + imageUrl;
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
    if (type == 'tournaments') {
      if (this.voteDetails && this.voteDetails[0]) {
        let playerVote = this.voteDetails[0]?.votes_tournament[id];
        if (playerVote && playerVote == 1) {
          return 'upVoteActive';
        } else {
          return 'upVote';
        }
        //return 'upVoteActive';
      } else {
        return 'downVote';
      }
    } 
    //return "";
  }

  getDownVoteClass(type, id) {
    if (type == 'tournaments') {
      if (this.voteDetails && this.voteDetails[0]) {
        let playerVote = this.voteDetails[0]?.votes_tournament[id];
        if (playerVote && playerVote == -1) {
          return 'downVoteActive';
        } else {
          return 'downVote';
        }
        //return 'downVoteActive';
      } else {
        return 'downVote';
      }
    }
  }

  upVote(type, id) {
    debugger
    let auth = localStorage.getItem('authGame');
    if (!auth) {
      this.loginPopup.show('Home');
    } else {
      var upVoteCount = '1';
      if (
        this.voteDetails &&
        this.voteDetails[0] &&
        this.voteDetails[0]?.votes_tournament[id] &&
        this.voteDetails[0]?.votes_tournament[id] == 1
      ) {
        upVoteCount = '0';
      }

      var raw = JSON.stringify({
        "type": type,
        "tournament_id" :this.tournanentId.toString(),
        "team_id" : id.toString(),
        "vote_count": upVoteCount.toString(),
      });
      //get data from backend
      let url = this.api.tournamentsVote;
      this.common.post(raw, url).subscribe(
        (res) => {

          if (res['success']) {
              this.getVoteDetails();
              this.getTournamentTeams();
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
        this.voteDetails[0]?.votes_tournament[id] &&
        this.voteDetails[0]?.votes_tournament[id] == -1
      ) {
        downVoteCount = '0';
      }

      var raw = JSON.stringify({
        "type": type,
        "tournament_id" :"2",
        "team_id" : id.toString(),
        "vote_count": downVoteCount.toString(),
      });
      
      //get data from backend
      let url = this.api.tournamentsVote;
      this.common.postWitoutAuthService(raw, url).subscribe(
        (res) => {
          if (res['success']) {
            // if (type == 'team') {
            //   //this.getTeamDetails();
            //   this.getTournamentTeams();
            //   this.getVoteDetails();
            // } else if (type == 'player') {
            //   this.getVoteDetails();
            //   this.getTrendingPLayerData();
            // }
            this.getVoteDetails();
            this.getTournamentTeams();
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
    let getVoteUrl = this.api.get_voting_data + '?tournament_id=1';
    this.common.get(getVoteUrl).subscribe(
      (res) => {
        this.voteDetails = res['data'];
        console.log("this.voteDetails", this.voteDetails);
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

  openLiveMatchDetails(match: any){
    debugger
    this.currentMatch = match?.name;
    let url = this.api.get_tournament_match_details;
    let formdata = JSON.stringify({
      "game_type":"PUBG",
      "tournament_id":match?.tournament__id.toString(),
      "match_id": match?.id.toString(),
    });
    this.common.postWitoutAuthService(formdata, url).subscribe(
      (res) => {
        if (res['success']) {
         this.pointTableTeamsData = res['data'];
         console.log("this.pointTableTeamsData pp", this.pointTableTeamsData);
         $('#link').modal('show');
        } else {
          this.toastr.error(res['message'], 'Error');
        }
      },
      (err) => {
        //this.loader = false;
      }
    );

    //console.log("match", match);
   
  }

}

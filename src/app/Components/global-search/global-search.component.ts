import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { CommonService } from 'src/app/Services/common.service';
import { LoginPopupComponent } from '../login-popup/login-popup.component';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent implements OnInit {
  @ViewChild('loginPopup', { static: true }) loginPopup: LoginPopupComponent;
  items = [];
  pageOfItems: Array<any>;
  searchData: any = [];
  allValue: any[];
  searchKey: any;
  searchType: any = 'all';
  voteDetails: any;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = Array(150)
      .fill(0)
      .map((x, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
    //this.getSearchData();
    //this.searchKey = "a";
    this.getVoteDetails();
  }

  ngAfterViewInit() {
    this.route.paramMap.subscribe((params) => {
      this.searchKey = params['params'].search;
      this.searchhValue();
    });
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }
  getSearchData() {
    let url = this.api.trending_players;
    this.common.getWitoutAuthService(url).subscribe(
      (res) => {
        this.searchData = res['data'];
      },
      (err) => {
        //this.loader = false;
      }
    );
  }
  searchhValue() {
    if (this.searchKey) {
      let url = this.api.global_sarch;
      this.common
        .getWitoutAuthService(url + '?keyword=' + this.searchKey)
        .subscribe(
          (res) => {
            this.searchData = res['data'];
            this.allValue = res['data'];
          },
          (err) => {
            //this.loader = false;
          }
        );
    }
  }
  getImageUrl(imageUrl) {
    if (imageUrl) {
      return 'http://159.65.148.113/media/' + imageUrl;
    } else {
      return 'assets/images/home/sample_player.png';
    }
  }
  selectSearchType() {
    if (this.searchType == 'all') {
      this.searchData = this.allValue;
    } else {
      this.searchData = this.allValue.filter(
        (item) => item.type === this.searchType
      );
    }
  }

  getDownVoteClass(type, id) {
    if (type == 'players') {
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
    } else if (type == 'teams') {
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
    if (type == 'players') {
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
    } else if (type == 'teams') {
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
    if (type == 'players') {
      type = 'player';
    }
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
              this.searchhValue();
            } else if (type == 'player') {
              this.searchhValue();
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
              //this.getVoteDetails();
              //this.getTrendingPLayerData();
              //this.getTrendingTeams();
              this.searchhValue();
            } else if (type == 'players') {
              // if (this.voteDetails && this.voteDetails[0] && this.voteDetails[0]?.votes_player[id] && this.voteDetails[0]?.votes_player[id] == -1) {
              //   this.trendingPlayer.find(e => e.id == id).downvote_score = this.trendingPlayer.find(e => e.id == id).downvote_score - 1;
              // } else {
              //   this.trendingPlayer.find(e => e.id == id).downvote_score = this.trendingPlayer.find(e => e.id == id).downvote_score + 1;
              // }
              //this.getVoteDetails();
              //this.getTrendingPLayerData();
              // this.getTrendingTeams();
              this.searchhValue();
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
  loadData() {
    this.getVoteDetails();
    this.refresh();
  }
  refresh(): void {
    window.location.reload();
  }
  gotoDetailsPage(value) {
    if (value.type == 'players') {
      this.router.navigate(['/playerDetails'], {
        queryParams: { id: value.id },
      });
    } else {
      this.router.navigate(['/teamDetails'], { queryParams: { id: value.id } });
    }
  }
}

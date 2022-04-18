import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { CommonService } from 'src/app/Services/common.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ChartComponent,
  ApexYAxis,
  ApexGrid,
  ApexLegend,
  ApexFill,
  ApexStroke,
} from 'ng-apexcharts';
import { ActivatedRoute, Router } from '@angular/router';
class Player {
  value: any;
  name: any;
}
class Link {
  id: any;
  name: any;
  value?: any;
  chartOptions: any;
  isDisplay: boolean;
}
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
  user_name: any;
}
declare var $: any;
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  fill: ApexFill;
  stroke: ApexStroke;
};
interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public profileChartOptions: Partial<ChartOptions>;
  is_active: boolean = true;
  links: Link[] = [];
  link: Link = new Link();
  linkSubmitted = false;
  profileDetails: ProfileDetails = new ProfileDetails();
  logo: File[] = [];
  profileSubmitted: boolean = false;
  currentTotalGraphData: any;
  foods: Food[];
  selectedTimeFrame = 'day';
  players = [];
  teams = [];
  voteDetails: any;
  profileView = false;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.foods = [
      { value: 'day', viewValue: 'day' },
      { value: 'week', viewValue: 'week' },
    ];
    this.getUserDetails();
    //this.getclickData("googpay");
    // let localLink =new Link();
    // localLink.id = 1;
    // localLink.name = "sahil";
    // localLink.value = "value";
    // this.links.push(localLink);
    // this.links.push(localLink);
    this.intialChartOPtion();
    this.getVoteDetails();
    this.getProfileData();
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if(queryParams['scrollTo'] === 'createLinks'){
        let ele =document.getElementById("createLinks");
        setTimeout(() => {
          ele.scrollIntoView();
        }, 500);
      }
    });
  }

  intialChartOPtion() {
    this.chartOptions = {
      series: [
        // {
        //   name: "Visiter",
        //   data: [21, 22, 10, 28, 16, 21, 13]
        // }
      ],
      chart: {
        toolbar: {
          show: false,
        },
        height: 350,
        type: 'bar',
        events: {
          click: function (chart, w, e) {},
        },
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#FFFFFF',
            fontSize: '12px',
          },
        },
      },
      fill: {
        colors: ['#FF0882'],
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 10,
        dashArray: 1,
      },
    };

    this.profileChartOptions = {
      series: [
        // {
        //   name: "Visiter",
        //   data: [21, 22, 10, 28, 16, 21, 13]
        // }
      ],
      chart: {
        toolbar: {
          show: false,
        },
        height: 350,
        type: 'bar',
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          },
        },
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#FFFFFF',
            fontSize: '12px',
          },
        },
      },
      fill: {
        colors: ['#FF0882'],
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 10,
        dashArray: 1,
      },
    };
  }
  checkTepmlateStatus(is_active_value) {
    this.is_active = !is_active_value;
  }
  pp() {}
  addLink() {
    this.link = new Link();
    $('#link').modal('show');
  }
  linkSubmit(value) {
    this.links.push(this.link);
    this.setLinkTree();
    $('#link').modal('hide');
  }

  deleteLink(index) {
    this.links.splice(index, 1);
    this.setLinkTree();
  }
  setLinkTree() {
    let linkObj = {};
    this.links.forEach((e) => {
      linkObj[e.name] = e.value;
    });

    var raw = JSON.stringify({ linked_tree: linkObj });
    let url = this.api.set_linked_tree;
    this.common.post(raw, url).subscribe(
      (res) => {
        if (res['success']) {
          this.getUserDetails();
        } else {
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
  }
  getUserDetails() {
    let url = this.api.get_profile;
    this.common.get(url).subscribe(
      (res) => {
        if (res['success']) {
          this.profileDetails = res['data'];
          var result = res['data'].linked_tree;
          let KeyValue = Object.keys(result).map((key) => [key, result[key]]);
          this.links = [];
          KeyValue.forEach((e) => {
            ////this.getclickData(e)
            let link = new Link();
            link.name = e[0];
            link.value = e[1];
            link.chartOptions = this.chartOptions;
            this.links.push(link);
          });
        } else if (!res['success'] && res['message'] == 'Anauthorized access') {
          this.logOut();
        }
      },
      (err) => {
        //this.loader = false;
      }
    );
  }
  editLink(value) {
    this.link = value;
    $('#link').modal('show');
  }
  logoUpload(event) {
    this.logo = [];
    this.logo.push(...event.addedFiles);
  }

  logoRemove(event) {
    this.logo = [];
  }
  profileSubmit(value) {
    let url = this.api.set_profile;
    var formdata = new FormData();
    //formdata.append("profile_pic", this.logo[0] || '');
    if (this.logo[0]) {
      formdata.append('profile_pic', this.logo[0], this.logo[0]?.name);
    }
    formdata.append('first_name', this.profileDetails.first_name);
    formdata.append('last_name', this.profileDetails.last_name);
    // formdata.append("user_name", "mdSahil123");

    this.common.post2(formdata, url).subscribe(
      (res) => {
        if (res['success']) {
          this.setUserName(
            this.profileDetails.first_name,
            this.profileDetails.last_name
          );
          this.getUserDetails();
          $('#profile').modal('hide');
        } else {
          this.toastr.error(res['message']);
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
  }
  setUserName(firstName, lastName) {
    let randomNumber = Math.floor(Math.random() * 9999999999);
    let userName = firstName + lastName + randomNumber;
    userName = userName.replace(/\s/g, '');
    let url = this.api.set_user_name;
    // let formdata = {
    //   "user_name" : userName
    // }
    var formdata = new FormData();
    formdata.append('user_name', userName);
    this.common.post2(formdata, url).subscribe(
      (res) => {
        if (res['success']) {
        } else {
          this.toastr.error(res['message']);
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
  }
  editProfileDetails() {
    $('#profile').modal('show');
  }
  getImageUrl(imageUrl) {
    if (imageUrl) {
      return 'http://159.65.148.113/media/' + imageUrl;
    } else {
      return 'assets/images/home/sample_player.png';
    }
  }
  redirectLink(data) {
    let urlVlue =
      this.api.set_linkedtree_stats +
      this.profileDetails?.user_name +
      '?url_name=' +
      data.name;
    this.common.getWitoutAuthService(urlVlue).subscribe(
      (res) => {
        if (res['success']) {
          window.open(data.value, '_blank');
        } else {
          console.log('res', res);
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
  }

  getclickData(data, isArea): any {
    let time_frame = 'week';
    let urlVlue =
      this.api.get_linked_tree_analytics +
      '?time_frame=' +
      this.selectedTimeFrame +
      '&url_name=' +
      data.name;
    this.common.get(urlVlue).subscribe(
      (res) => {
        if (res['success']) {
          this.intialChartOPtion();
          this.currentTotalGraphData = res['data'];
          if (this.currentTotalGraphData.length > 0) {
            let categories = [];
            let categoriesValue = [];
            this.currentTotalGraphData?.forEach((element) => {
              if (this.selectedTimeFrame == 'day') {
                categories.push(element.date);
              } else if (this.selectedTimeFrame == 'week') {
                categories.push(element.week);
              }
              categoriesValue.push(element.cnt);
            });
            let finalCategoriesValue = {
              name: 'Visiter',
              data: categoriesValue,
            };
            this.chartOptions.xaxis.categories = categories;
            this.chartOptions.series.push(finalCategoriesValue);
          }

          this.links.find((e) => e.name == data.name).chartOptions =
            this.chartOptions;

          //show and hide section
          if (isArea) {
            this.links.find((e) => e.name == data.name).isDisplay =
              !this.links.find((e) => e.name == data.name).isDisplay;
          }
        } else {
          return [];
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
  }
  getProfileclickData(isArea): any {
    let urlVlue =
      this.api.get_linked_tree_analytics +
      '?time_frame=' +
      this.selectedTimeFrame;
    this.common.get(urlVlue).subscribe(
      (res) => {
        if (res['success']) {
          this.intialChartOPtion();
          this.currentTotalGraphData = res['data'];
          if (this.currentTotalGraphData.length > 0) {
            let categories = [];
            let categoriesValue = [];
            this.currentTotalGraphData?.forEach((element) => {
              if (this.selectedTimeFrame == 'day') {
                categories.push(element.date);
              } else if (this.selectedTimeFrame == 'week') {
                categories.push(element.week);
              }
              categoriesValue.push(element.cnt);
            });
            let finalCategoriesValue = {
              name: 'Visiter',
              data: categoriesValue,
            };
            this.profileChartOptions.xaxis.categories = categories;
            this.profileChartOptions.series.push(finalCategoriesValue);
          }

          //show and hide section
          if (isArea) {
          }
        } else {
          return [];
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
  }

  goToPreview(link) {
    let actualLink = 'http://143.110.178.62/#/linkedtree/' + link;
    window.open(actualLink, '_blank');
  }
  updateAnalysicStatus(data) {
    this.getclickData(data, true);
  }
  getAnalysisClass(isDisplay) {
    if (!isDisplay) {
      return 'analysys';
    } else {
      return 'analysysHover';
    }
  }
  getVoteDetails() {
    let getVoteUrl = this.api.get_voting_data;
    this.common.get(getVoteUrl).subscribe(
      (res) => {
        //for voted players
        let votePlayers = res['data'][0]?.votes_player;
        let playerKeyValue = Object.keys(votePlayers).map((key) => [
          key,
          votePlayers[key],
        ]);
        playerKeyValue.forEach((e) => {
          this.getPlayerDetails(e);
        });

        //for voted teams
        let voteTeams = res['data'][0].votes_teams;
        let teamsKeyValue = Object.keys(voteTeams).map((key) => [
          key,
          voteTeams[key],
        ]);
        teamsKeyValue.forEach((e) => {
          this.getTeamDetails(e);
        });
      },
      (err) => {
        //this.loader = false;
      }
    );
  }
  getPlayerDetails(value) {
    this.players = [];
    let url = this.api.get_player;
    this.common.getWitoutAuthService(`${url}${value[0]}`).subscribe(
      (res) => {
        let playerData = res['data'];
        playerData.isUporDown = value[1];
        this.players.push(playerData);
      },
      (err) => {
        //this.loader = false;
      }
    );
  }

  getTeamDetails(value) {
    let url = this.api.get_team;
    this.common.getWitoutAuthService(`${url}${value[0]}`).subscribe(
      (res) => {
        let teamData = res['data'];
        teamData.isUporDown = value[1];
        this.teams.push(teamData);
      },
      (err) => {
        //this.loader = false;
      }
    );
  }
  logOut() {
    localStorage.removeItem('authGame');
    this.toastr.success('logout successfully');
    this.refresh();
    this._router.navigate(['/']);
  }
  refresh(): void {
    window.location.reload();
  }
  getUPDownVoteClass(type) {
    if (type == 1) {
      return 'tm_txt_up';
    } else {
      return 'tm_txt_down';
    }
  }

  getProfileData(): any {
    let urlVlue =
      this.api.get_linked_tree_analytics +
      '?time_frame=' +
      this.selectedTimeFrame;
    this.common.get(urlVlue).subscribe(
      (res) => {
        if (res['success']) {
          this.intialChartOPtion();
          this.currentTotalGraphData = res['data'];
          if (this.currentTotalGraphData.length > 0) {
            let categories = [];
            let categoriesValue = [];
            this.currentTotalGraphData?.forEach((element) => {
              if (this.selectedTimeFrame == 'day') {
                categories.push(element.date);
              } else if (this.selectedTimeFrame == 'week') {
                categories.push(element.week);
              }
              categoriesValue.push(element.cnt);
            });
            let finalCategoriesValue = {
              name: 'Visiter',
              data: categoriesValue,
            };
            this.profileChartOptions.xaxis.categories = categories;
            this.profileChartOptions.series.push(finalCategoriesValue);
          }

          console.log(
            ' this.chartOptions this.chartOptions',
            this.chartOptions
          );
        } else {
          return [];
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
  }
}

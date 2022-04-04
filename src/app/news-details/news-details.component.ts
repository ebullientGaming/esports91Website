import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginPopupComponent } from '../Components/login-popup/login-popup.component';
import { ApiService } from '../Services/api.service';
import { CommonService } from '../Services/common.service';

interface news {
  created_at: any,
  description: any,
  description_para: any,
  id: any,
  image: any,
  title: any
}

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.scss']
})
export class NewsDetailsComponent implements OnInit {
  @ViewChild('loginPopup', { static: true }) loginPopup: LoginPopupComponent;
  loader: boolean;
  newsDetails: news;
  newsId : any;
  constructor(private common: CommonService, private api: ApiService,private _activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.newsId = this._activatedRoute.snapshot.queryParams['id'];
    let newJson = {
      "created_at": "2021-12-29T19:40:44.127Z",
      "description": "somo is deaf",
      "description_para": "",
      "id": "4",
      "image": "assets/images/home/newws_back.png",
      "title": "hi this is the title"
    }
    let url = this.api.get_news;
    this.common.getWitoutAuthService(url).subscribe(res => {
      let filterData = res['data'].filter(e=>e.id == this.newsId);
      this.newsDetails = filterData[0];
    }, (err) => {
      //this.loader = false;
    });
  }

  getImageUrl(imageUrl) {

    if (imageUrl) {
      return 'http://159.65.148.113/media/' + imageUrl;
    }
    else {
      return 'assets/images/home/sample_player.png';
    }
  }

}

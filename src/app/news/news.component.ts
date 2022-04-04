import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  loader: boolean;
  newsDetails: news;
  users = [1,2,3,4];
  constructor(private router : Router,private common: CommonService, private api: ApiService) { }

  ngOnInit(): void {
    let url = this.api.get_news;
    this.common.getWitoutAuthService(url).subscribe(res => {
      this.newsDetails = res['data'];
    }, (err) => {
      //this.loader = false;
    });
  }

  gotoNews(news){
    this.router.navigate(['/news-details'], { queryParams: { id: news.id} });
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

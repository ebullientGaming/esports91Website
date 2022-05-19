import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  feedbackContent: string;

  constructor(private common: CommonService) { }

  ngOnInit(): void {
    this.common.getFeedBack()
    .then(r => r.json()).then(j => { 
      this.feedbackContent = j.message; 
    });
  }

}

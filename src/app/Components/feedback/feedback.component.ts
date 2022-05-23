import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  feedbackContent: string = '';

  constructor(private common: CommonService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  saveFeedBack() {
    if(!this.feedbackContent) {
      return
    }
    this.common.saveFeedBack(this.feedbackContent)
    .then(r => r.json()).then(j => { 
      if(j.success){
        this.feedbackContent = '';
        this.toastr.success('Saved successfully');
      }
    });
  }

}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component';
import { NabBarComponent } from './Components/nab-bar/nab-bar.component';
import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPopupComponent } from './Components/login-popup/login-popup.component';
import {  BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TrendingPlayerComponent } from './Components/trending-player/trending-player.component';
import { JwPaginationModule } from 'jw-angular-pagination';
import { TrendingTeamsComponent } from './Components/trending-teams/trending-teams.component';
import { TeamDetailsComponent } from './Components/team-details/team-details.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { PlayerDetailsComponent } from './Components/player-details/player-details.component';
import { FooterComponent } from './Components/footer/footer.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './Components/profile/profile.component';
import { GlobalSearchComponent } from './Components/global-search/global-search.component';
import { ToastrModule } from 'ngx-toastr';
import { ProfileViewComponent } from './Components/profile-view/profile-view.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgApexchartsModule } from 'ng-apexcharts';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { InterceptorService } from './Components/loader/interceptor.service';
import {MatSelectModule} from '@angular/material/select';
import { PrivacyComponent } from './Components/privacy/privacy.component';
import { NewsDetailsComponent } from './news-details/news-details.component';
import { NewsComponent } from './news/news.component';
import { AboutUsComponent } from './Components/about-us/about-us.component';
import { FeedbackComponent } from './Components/feedback/feedback.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NabBarComponent,
    LoginPopupComponent,
    TrendingPlayerComponent,
    TrendingTeamsComponent,
    TeamDetailsComponent,
    PlayerDetailsComponent,
    FooterComponent,
    ProfileComponent,
    GlobalSearchComponent,
    ProfileViewComponent,
    PrivacyComponent,
    NewsDetailsComponent,
    NewsComponent,
    AboutUsComponent,
    FeedbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbPaginationModule, 
    NgbAlertModule,
    FormsModule,
    BrowserAnimationsModule,
    AccordionModule.forRoot(),
    ModalModule.forRoot(),                             
    ReactiveFormsModule ,
    HttpClientModule,
    JwPaginationModule,
    MatTabsModule,
    MatExpansionModule,
    NgOtpInputModule,
    CommonModule,
    ToastrModule.forRoot(),
    NgxDropzoneModule,
    NgApexchartsModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  providers: [BsModalService
  //{provide:HTTP_INTERCEPTORS, useClass:InterceptorService,multi:true}
],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './Components/about-us/about-us.component';
import { FeedbackComponent } from './Components/feedback/feedback.component';
import { GlobalSearchComponent } from './Components/global-search/global-search.component';
import { HomeComponent } from './Components/home/home.component';
import { PlayerDetailsComponent } from './Components/player-details/player-details.component';
import { PrivacyComponent } from './Components/privacy/privacy.component';
import { ProfileViewComponent } from './Components/profile-view/profile-view.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { TeamDetailsComponent } from './Components/team-details/team-details.component';
import { TrendingPlayerComponent } from './Components/trending-player/trending-player.component';
import { TrendingTeamsComponent } from './Components/trending-teams/trending-teams.component';
import { NewsDetailsComponent } from './news-details/news-details.component';
import { NewsComponent } from './news/news.component';
import { AuthGuard } from './Services/authGuard/auth.guard';


const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'trendingPlayer',component:TrendingPlayerComponent},
  {path:'trendingTeams',component:TrendingTeamsComponent},
  {path:'teamDetails', component:TeamDetailsComponent},
  {path:'playerDetails', component:PlayerDetailsComponent},
  {path:'profile', component:ProfileComponent, canActivate: [AuthGuard]},
  {path:'search',component:GlobalSearchComponent},
  {path:'privacy',component:PrivacyComponent, canActivate: [AuthGuard]},
  {path:'about-us',component:AboutUsComponent, canActivate: [AuthGuard]},
  {path:'feedback',component:FeedbackComponent, canActivate: [AuthGuard]},
  {path:'linkedtree/:id',component:ProfileViewComponent},
  {path:'news',component:NewsComponent},
  {path:'news-details',component:NewsDetailsComponent},
  //{path:"**",component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

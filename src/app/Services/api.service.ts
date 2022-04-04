import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private global : GlobalService) { }
  loginRequest = this.global.base_url + '/user_logs/login_request'
  login = this.global.base_url + '/user_logs/login'
  trending_players = this.global.base_url + '/trending_players'
  trending_teams = this.global.base_url + '/trending_teams'
  get_team = this.global.base_url + '/get_team/'
  get_player = this.global.base_url + '/get_player/'
  get_profile = this.global.base_url  +'/user_logs/get_profile'
  set_linked_tree = this.global.base_url  +'/user_logs/set_linked_tree'
  global_sarch = this.global.base_url  +'/search'
  get_voting_data = this.global.base_url + '/user_logs/get_voting_data'
  vote = this.global.base_url + '/user_logs/vote'
  set_profile = this.global.base_url + '/user_logs/set_profile'
  linkedtree = this.global.base_url + '/linkedtree/'
  set_user_name = this.global.base_url + '/user_logs/set_user_name'
  set_linkedtree_stats = this.global.base_url + '/set_linkedtree_stats/'
  get_linked_tree_analytics = this.global.base_url + '/user_logs/get_linked_tree_analytics'
  get_news = this.global.base_url + '/get_news'
}


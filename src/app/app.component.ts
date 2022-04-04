import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLinkedtree : boolean = false;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            if(this.router.url.toString().includes("/linkedtree")){
              this.isLinkedtree = true;
            }else{
              this.isLinkedtree = false;
            }
        });
    }
  title = 'game';
}

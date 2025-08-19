import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { StatesService } from 'src/app/services/states.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title = '';
  icon = '';

  constructor(private stateService: StatesService) { }

  ngOnInit(): void {
    // console.log(this.stateService)
    this.stateService.currentRoute$
    .pipe(
      tap(x => console.log('currentRoute$', x))
    )
    .subscribe(
      route => {

      }
    );
  }



}

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
    this.stateService.appState$
    .pipe(
      tap(info => console.log('appState$', info))
    )
    .subscribe(
      stateInfo => {
        this.setHeaderInfo(stateInfo);
      }
    );
  }

  setHeaderInfo(stateInfo: any | {}) {
    this.title = stateInfo.name || '';
    this.icon = this.getWhiteIcon(stateInfo.icon);
  }

  getWhiteIcon(icon: string): string {
    if(!icon) return '';
    return icon.replace('.png', '-white.png');
  }

}

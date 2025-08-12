import { Component, OnInit } from '@angular/core';
import { ThrowInfo } from 'src/app/interfaces/throw';
import { InfoDartboardService } from 'src/app/services/info-dartboard.service';

@Component({
  selector: 'app-throws',
  templateUrl: './throws.component.html',
  styleUrls: ['./throws.component.scss']
})
export class ThrowsComponent implements OnInit {

  throwInfo: ThrowInfo[] = [];

  constructor(private infoService: InfoDartboardService) { }

  ngOnInit(): void {
    this.infoService.throwInfo$
    .pipe()
    .subscribe(
      (throwInfo) => {
        console.log('throwInfo$ changed', throwInfo)
        this.throwInfo = throwInfo;
      }
    );
  }

}

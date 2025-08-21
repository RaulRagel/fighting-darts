import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tap } from 'rxjs/operators';
import { StatesService } from 'src/app/services/states.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() showBackButton: boolean = false;

  constructor(private utilsService: UtilsService) { }

  ngOnInit(): void {

    this.icon = this.utilsService.getIconUrl(this.icon, 'white');
  }

}

import { Component, Input, OnInit } from '@angular/core';
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
  subtitle: string = 'Turno de:';

  constructor(private utilsService: UtilsService) { }

  ngOnInit(): void {

    this.icon = this.utilsService.getIconUrl(this.icon, {color: 'white'});
  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
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
  @Input() subtitle: string = '';

  @Input() extraButtons: any[] = [];

  @Output() back = new EventEmitter<void>();

  constructor(private utilsService: UtilsService, private stateService: StateService) { }

  ngOnInit(): void {
    this.icon = this.utilsService.getIconUrl(this.icon, {color: 'white'});
  }

  onBackClick() {
    this.stateService.goBack();
    this.back.emit();
  }

}

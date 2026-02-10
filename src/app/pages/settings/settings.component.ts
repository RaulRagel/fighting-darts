import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuButton } from 'src/app/interfaces/menu-button';
import { ConfigService } from 'src/app/services/config.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    randomPlayerOrder$: Observable<boolean>;

    defaultsBtn: MenuButton = {
        name: 'Restablecer',
        icon: this.utilsService.getIconUrl('refresh', {color: 'red'}),
        action: () => this.resetDefaults()
    }

    constructor(private configService: ConfigService, private utilsService: UtilsService) {
        this.randomPlayerOrder$ = this.configService.getSetting$('randomPlayerOrder');
    }

    ngOnInit(): void {}

    toggleRandom(value: boolean) {
        this.configService.updateSetting('randomPlayerOrder', value);
    }

    resetDefaults(): void {
        this.configService.resetToDefaults();
    }
}

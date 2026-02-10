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
    maxHealth$: Observable<number>;

    private readonly MIN_HEALTH = 1;
    private readonly MAX_HEALTH = 50;

    defaultsBtn: MenuButton = {
        name: 'Restablecer',
        icon: this.utilsService.getIconUrl('refresh', {color: 'red'}),
        action: () => this.resetDefaults()
    }

    constructor(private configService: ConfigService, private utilsService: UtilsService) {
        this.randomPlayerOrder$ = this.configService.getSetting$('randomPlayerOrder');
        this.maxHealth$ = this.configService.getSetting$('maxHealth');
    }

    ngOnInit(): void {}

    toggleRandom(value: boolean) {
        this.configService.updateSetting('randomPlayerOrder', value);
    }

    updateMaxHealth(value: number) {
        // Validar rango
        let validValue = value;
        if (value < this.MIN_HEALTH) validValue = this.MIN_HEALTH;
        if (value > this.MAX_HEALTH) validValue = this.MAX_HEALTH;
        
        this.configService.updateSetting('maxHealth', validValue);
    }

    resetDefaults(): void {
        this.configService.resetToDefaults();
    }
}

import { Component, OnInit } from '@angular/core';
import { MenuButton } from 'src/app/interfaces/menu-button';
import { StatesService } from 'src/app/services/states.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  buttons: MenuButton[] = [
    {
      name: 'Añadir jugadores',
      icon: 'assets/images/icons/players.png',
      action: this.goToPlayers.bind(this)
    },
    {
      name: 'Instrucciones',
      icon: 'assets/images/icons/question.png'
    },
    {
      name: 'Ajustes',
      icon: 'assets/images/icons/settings.png',
      action: this.goToSettings.bind(this)
    },
    // {
    //   name: 'Créditos',
    //   icon: 'assets/images/icons/credits.png'
    // },
    // {
    //   name: 'Contacto',
    //   icon: 'assets/images/icons/mail.png'
    // }
  ]

  constructor(private statesService: StatesService) { }

  ngOnInit(): void {
  }

  goToPlayers() {
    this.statesService.navigateTo('/players');
  }

  goToSettings() {
    this.statesService.navigateTo('/settings');
  }

}

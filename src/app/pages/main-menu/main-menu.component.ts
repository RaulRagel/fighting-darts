import { Component, OnInit } from '@angular/core';
import { MenuButton } from 'src/app/interfaces/menu-button';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  buttons: MenuButton[] = [
    {
      // id: 'players',
      name: 'Añadir jugadores',
      icon: 'assets/images/icons/players.png',
      action: () => this.goTo('players')
    },
    {
      // id: 'instructions',
      name: 'Instrucciones',
      icon: 'assets/images/icons/question.png',
      action: () => this.goTo('instructions')
    },
    {
      // id: 'settings',
      name: 'Ajustes',
      icon: 'assets/images/icons/settings.png',
      action: () => this.goTo('settings')
    },
    // {
    //   name: 'Créditos',
    //   icon: 'assets/images/icons/credits.png'
    // },
    // {
    //   name: 'Contacto',
    //   icon: 'assets/images/icons/mail.png'
    // }
  ];

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    // this.initButtons();
  }

  // initButtons() {
  //   this.buttons = this.stateService.getStates().map(state => ({
  //     id: state.id || '',
  //     name: state.name || '',
  //     icon: state.icon || '',
  //     action: () => this.goTo(state.id || '')
  //   }));
  // }

  goTo(id: string) {
    // var appState = this.buttons.find(button => button.id === id);
    this.stateService.navigateTo(`/${id}`);
    // this.stateService.setAppState(appState || {});
  }

}

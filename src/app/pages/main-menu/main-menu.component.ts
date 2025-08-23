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
      // id: 'players',
      name: 'Añadir jugadores',
      icon: 'assets/images/icons/players.png',
      action: () => this.goTo('players')
    },
    {
      // id: 'question',
      name: 'Instrucciones',
      icon: 'assets/images/icons/question.png'
    },
    {
      // id: 'settings',
      name: 'Ajustes',
      icon: 'assets/images/icons/settings.png'
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

  constructor(private statesService: StatesService) { }

  ngOnInit(): void {
    // this.initButtons();
  }

  // initButtons() {
  //   this.buttons = this.statesService.getStates().map(state => ({
  //     id: state.id || '',
  //     name: state.name || '',
  //     icon: state.icon || '',
  //     action: () => this.goTo(state.id || '')
  //   }));
  // }

  goTo(id: string) {
    // var appState = this.buttons.find(button => button.id === id);
    this.statesService.navigateTo(`/${id}`);
    // this.statesService.setAppState(appState || {});
  }

}

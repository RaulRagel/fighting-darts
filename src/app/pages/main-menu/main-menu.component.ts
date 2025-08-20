import { Component, OnInit } from '@angular/core';
import { MenuButton } from 'src/app/interfaces/menu-button';
import { StatesService } from 'src/app/services/states.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  buttons!: MenuButton[];

  constructor(private statesService: StatesService) { }

  ngOnInit(): void {
    this.initButtons();
  }

  initButtons() {
    this.buttons = this.statesService.getStates().map(state => ({
      id: state.id || '',
      name: state.name || '',
      icon: state.icon || '',
      action: () => this.goTo(state.id || '')
    }));
  }

  goTo(id: string) {
    var appState = this.buttons.find(button => button.id === id);
    this.statesService.navigateTo(`/${id}`);
    this.statesService.setAppState(appState || {});
  }

}

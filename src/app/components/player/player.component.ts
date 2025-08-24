import { UtilsService } from './../../services/utils.service';
import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaces/player';
import { GenericButton } from 'src/app/interfaces/generic-button';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() player!: Player;
  @Input() editable: boolean = false;

  buttons: GenericButton[] = [ // todo mover a default-factory.service
    {
      name: 'Personajes',
      icon: this.utilsService.getIconUrl('avatar', {color: 'gray'}),
      action: () => this.displaySelector('characters')
    },
    {
      name: 'Habilidades',
      icon: this.utilsService.getIconUrl('skill', {color: 'yellow', subcarpet: 'skills'}),
      action: () => this.displaySelector('skills')
    }
  ];

  currentSelector = '';

  selectableSkills = this.utilsService.getSkills();
  selectableCharacters = this.utilsService.getFighterIcons();
  selectableColors = this.utilsService.getFighterColors();
  fighterGif = '';
  backgroundColor = '';

  constructor(private utilsService: UtilsService, private gameService: GameService) { }

  ngOnInit(): void {
    console.log('Player data:', this.player);

    this.player.color = '#646464';
    this.player.fighterGif = '1';

    this.updatePlayer(this.player);
  }

  private updatePlayer(player: Player) {
    this.setBackground(player.color);
    this.setFighterGif(player.fighterGif);
    this.gameService.modifyPlayer(player);
  }

  private setBackground(color?: string) {
    this.backgroundColor = `linear-gradient(120deg, #000000 0%, ${color || '#646464'} 100%)`;
  }

  private setFighterGif(number?: number | string) {
    this.fighterGif = this.utilsService.getFighterGif(number || 1);
  }

  displaySelector(selector: string) {
    let newSelector = selector;
    if(!selector || this.currentSelector === selector) newSelector = '';
    this.currentSelector = newSelector;
  }

  // selectCharacter
  // selectColor

}

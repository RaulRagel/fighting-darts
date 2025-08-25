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

  currentSelector = '';

  fighterGif = '';
  backgroundColor = '';
  selectedSkill = '';

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

  constructor(private utilsService: UtilsService, private gameService: GameService) { }

  ngOnInit(): void {
    console.log('Player data:', this.player);

    this.player.color = '#646464';
    this.player.fighterGif = '1';

    this.setBackground(this.player.color);
    this.setFighterGif(this.player.fighterGif);
    this.gameService.modifyPlayer(this.player);
  }

  onPlayerNameChange(event: any) {
    this.player.name = event.target.value;
    this.gameService.modifyPlayer(this.player);
  }

  private setBackground(color?: string) {
    this.backgroundColor = `linear-gradient(120deg, #000000 0%, ${color || '#646464'} 100%)`;
  }

  private setFighterGif(number?: number | string) {
    if(!number) number = Math.floor(Math.random() * this.utilsService.totalFighters) + 1;
    this.fighterGif = this.utilsService.getFighterGif(number || 1);
  }

  private displaySelector(selector: string) {
    let newSelector = selector;
    if(!selector || this.currentSelector === selector) newSelector = '';
    this.currentSelector = newSelector;
  }

  onCharacterSelected(characterNumber: string | number) {
    console.log('Character selected event:', characterNumber);
    this.player.fighterGif = characterNumber;
    this.setFighterGif(this.player.fighterGif);
    this.gameService.modifyPlayer(this.player);
  }

  onColorSelected(colorHash: string) {
    console.log('Color selected event:', colorHash);
    this.player.color = colorHash;
    this.setBackground(this.player.color);
    this.gameService.modifyPlayer(this.player);
  }

  onSkillSelected(skillName: string) {
    console.log('Skill selected event:', skillName);
    this.player.skill = this.utilsService.getSkillByName(skillName);
    this.selectedSkill = skillName;
    this.closeSelector();
    this.gameService.modifyPlayer(this.player);
  }

  deleteSkill() {
    delete this.player.skill;
    this.selectedSkill = '';
    this.gameService.modifyPlayer(this.player);
  }

  closeSelector() {
    this.currentSelector = '';
  }

  deletePlayer() {
    this.gameService.removePlayer(this.player.id!);
  }
}

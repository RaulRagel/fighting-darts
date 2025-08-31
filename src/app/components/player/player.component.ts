import { UtilsService } from './../../services/utils.service';
import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaces/player';
import { GenericButton } from 'src/app/interfaces/generic-button';
import { GameService } from 'src/app/services/game.service';
import { Skill } from 'src/app/interfaces/skill';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() player!: Player;
  @Input() editable: boolean = false;

  currentSelector = '';

  buttons: GenericButton[] = [
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
  }

  get totalPlayers() {
    return this.gameService.currentPlayers.length;
  }

  onPlayerNameChange(event: any) {
    this.player.name = event.target.value;
    this.gameService.modifyPlayer(this.player);
  }

  private displaySelector(selector: string) {
    let newSelector = selector;
    if(!selector || this.currentSelector === selector) newSelector = '';
    this.currentSelector = newSelector;
  }

  // In edit mode actions

  onCharacterSelected(characterNumber: string | number) {
    // console.log('Character selected event:', characterNumber);
    this.player.fighterGif = this.utilsService.parseFighterGif(characterNumber);
    this.gameService.modifyPlayer(this.player);
  }

  onColorSelected(colorHash: string) {
    // console.log('Color selected event:', colorHash);
    this.player.color = colorHash;
    this.player.background = this.utilsService.parseBackgroundColor(colorHash);
    this.gameService.modifyPlayer(this.player);
  }

  onSkillSelected(skill: Skill) {
    if(!skill.description) delete this.player.skill;
    else this.player.skill = skill;
    this.closeSelector();
    this.gameService.modifyPlayer(this.player);
  }

  closeSelector() {
    this.currentSelector = '';
  }

  deletePlayer() {
    this.gameService.removePlayer(this.player.id!);
  }

  // In game actions

  hit(points: number = 1) {
    if(!this.player.hp$) return;

    const currentHp = this.player.hp$.getValue();
    let damaged = currentHp - points;
    if(damaged < 0) damaged = 0;
    this.player.hp$.next(damaged);
  }

  heal(points: number = 1) {
    if(!this.player.hp$) return;
    const currentHp = this.player.hp$.getValue();
    let healed = currentHp + points;
    if(healed > this.utilsService.maxHealth) healed = this.utilsService.maxHealth;
    this.player.hp$.next(healed);
  }
}

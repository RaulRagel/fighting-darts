import { UtilsService } from './../../services/utils.service';
import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaces/player';
import { GenericButton } from 'src/app/interfaces/generic-button';

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
      action: () => this.displayCharacters()
    },
    {
      name: 'Habilidades',
      icon: this.utilsService.getIconUrl('skill', {color: 'yellow', subcarpet: 'skills'}),
      action: () => this.displaySkills()
    }
  ];

  constructor(private utilsService: UtilsService) { }

  ngOnInit(): void {
    console.log('Player data:', this.player);
  }

  displayCharacters() {
    console.log('displayCharacters', this);
  }

  displaySkills() {
    console.log('displaySkills', this);
  }

}

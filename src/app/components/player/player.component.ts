import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/interface/player';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  @Input() player!: Player;
  @Input() editable: boolean = false;

  constructor() { }

  ngOnInit(): void {
    console.log('Player data:', this.player);
  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from 'src/app/interfaces/player';

@Component({
  selector: 'app-player-info-display',
  templateUrl: './player-info-display.component.html',
  styleUrls: ['./player-info-display.component.scss']
})
export class GenericInfoComponent implements OnInit {

  @Input() player!: Player;
  @Output() closeInfo = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
    
  }

  close() {
    this.closeInfo.emit();
  }
}

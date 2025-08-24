import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-character-selector',
  templateUrl: './character-selector.component.html',
  styleUrls: ['./character-selector.component.scss']
})
export class CharacterSelectorComponent implements OnInit {

  characters = this.utilsService.getFighterIcons();
  colors = this.utilsService.getFighterColors();
  @Output() characterEmitter = new EventEmitter<string>();
  @Output() colorEmitter = new EventEmitter<string>();
  @Output() closeEmitter = new EventEmitter<string>();

  constructor(private utilsService: UtilsService) { }

  ngOnInit(): void {
    console.log('Characters:', this.characters);
    console.log('Colors:', this.colors);
  }

  selectCharacter(characterId: any) {
    console.log('Selected character:', characterId);
    this.characterEmitter.emit(characterId);
  }

  selectColor(color: string) {
    console.log('Selected color:', color);
    this.colorEmitter.emit(color);
  }

  closeSelector() {
    this.closeEmitter.emit();
  }
}


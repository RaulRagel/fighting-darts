import { Injectable } from '@angular/core';
import { Player } from '../interfaces/player';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  playersSubject = new BehaviorSubject<Player[]>([]);
  players$ = this.playersSubject.asObservable();
  count = 0;

  constructor(private utilsService: UtilsService) { }

  addNewPlayer() {
    const currentPlayers = this.playersSubject.getValue();
    this.playersSubject.next([...currentPlayers, {
      id: new Date().getTime() + currentPlayers.length,
      name: 'Player ' + (++this.count),
      color: '#797979',
      background: this.utilsService.parseBackgroundColor('#797979'),
      fighterGif: this.utilsService.parseFighterGif(1),
      skill: { name: 'Ninguna'},
      hp$: new BehaviorSubject<number>(this.utilsService.maxHealth)
    }]);
  }

  modifyPlayer(player: Player) {
    const currentPlayers = this.playersSubject.getValue();
    const index = currentPlayers.findIndex(p => p.id === player.id);

    if (index !== -1) {
      currentPlayers[index] = player;
      this.playersSubject.next([...currentPlayers]);
      console.log('Player modified:', player);
    } else {
      console.error('Player not found:', player);
    }
  }

  // modifyPlayerById

  removePlayer(playerId: number) {
    const currentPlayers = this.playersSubject.getValue();
    const updatedPlayers = currentPlayers.filter(p => p.id !== playerId);

    this.playersSubject.next(updatedPlayers);
  }
}

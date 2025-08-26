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

  addPlayer(...players: Player[]) {
    const currentPlayers = this.playersSubject.getValue();
    players = players.map(player => {
      if(!player.name) player.name = 'Player ' + (++this.count);
      return {
        ...player,
        id: new Date().getTime() + currentPlayers.length,
        hp$: new BehaviorSubject<number>(this.utilsService.maxHealth)
      }
    });

    this.playersSubject.next([...currentPlayers, ...players]);
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

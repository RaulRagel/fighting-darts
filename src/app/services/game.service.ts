import { Injectable } from '@angular/core';
import { Player } from '../interfaces/player';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  playersSubject = new BehaviorSubject<Player[]>([]);
  players$ = this.playersSubject.asObservable();

  constructor() { }

  addPlayer(...players: Player[]) {
    const currentPlayers = this.playersSubject.getValue();
    players = players.map((player, index) => {
      if(!player.name) player.name = 'Sin nombre';
      return {
        ...player,
        id: new Date().getTime() + index
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
    } else {
      console.warn('Player not found:', player);
    }
  }

  // modifyPlayerById

  removePlayer(playerId: number) {
    const currentPlayers = this.playersSubject.getValue();
    const updatedPlayers = currentPlayers.filter(p => p.id !== playerId);

    this.playersSubject.next(updatedPlayers);
  }
}

import { Injectable } from '@angular/core';
import { Player } from '../interface/player';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  playersSubject = new BehaviorSubject<Player[]>([]);
  players$ = this.playersSubject.asObservable();

  constructor() { }

  addPlayer(...player: Player[]) {
    const currentPlayers = this.playersSubject.getValue();
    if (currentPlayers.some(p => player.some(newPlayer => newPlayer.name === p.name))) {
      console.warn('Player with the same name already exists:', player);
      return;
    }
    this.playersSubject.next([...currentPlayers, ...player]);
  }

  modifyPlayer(player: Player) {
    const currentPlayers = this.playersSubject.getValue();
    const index = currentPlayers.findIndex(p => p.name === player.name);

    if (index !== -1) {
      currentPlayers[index] = player;
      this.playersSubject.next([...currentPlayers]);
    } else {
      console.warn('Player not found:', player);
    }
  }

  removePlayer(playerName: string) {
    const currentPlayers = this.playersSubject.getValue();
    const updatedPlayers = currentPlayers.filter(p => p.name !== playerName);

    this.playersSubject.next(updatedPlayers);
  }
}

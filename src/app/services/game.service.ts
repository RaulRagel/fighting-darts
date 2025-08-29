import { Injectable } from '@angular/core';
import { Player } from '../interfaces/player';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from './utils.service';
import { BoardZone } from '../interfaces/board-zone';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  playersSubject = new BehaviorSubject<Player[]>([]);
  players$ = this.playersSubject.asObservable();
  count = 0;

  turnOfSubject = new BehaviorSubject<number>(0);
  turnOf$ = this.turnOfSubject.asObservable();

  roundSubject = new BehaviorSubject<number>(1);
  round$ = this.roundSubject.asObservable();

  boardZonesSubject = new BehaviorSubject<BoardZone[]>([]);
  boardZones$ = this.boardZonesSubject.asObservable();

  get boardZones(): BoardZone[] {
    return this.boardZonesSubject.getValue();
  }

  constructor(private utilsService: UtilsService) { }

  get currentPlayers(): Player[] {
    return this.playersSubject.getValue();
  }

  // In edit mode actions

  addNewPlayer(params: Partial<Player> = {}) {
    const currentPlayers = this.currentPlayers;
    this.playersSubject.next([...currentPlayers, {
      id: new Date().getTime() + currentPlayers.length,
      name: params.name || 'Player',
      isAlive: false,
      color: '#797979',
      background: this.utilsService.parseBackgroundColor('#797979'),
      fighterGif: this.utilsService.parseFighterGif(1),
      skill: { name: 'Ninguna'},
      hp$: new BehaviorSubject<number>(this.utilsService.maxHealth)
    }]);
  }

  modifyPlayer(player: Player) {
    const currentPlayers = this.currentPlayers;
    const index = currentPlayers.findIndex(p => p.id === player.id);

    if (index !== -1) {
      if(!player.name) player.name = 'Player';
      currentPlayers[index] = player;
      this.playersSubject.next([...currentPlayers]);
      console.log('Player modified:', player);
    } else {
      console.error('Player not found:', player);
    }
  }

  // modifyPlayerById

  removePlayer(playerId: number) {
    const currentPlayers = this.currentPlayers;
    const updatedPlayers = currentPlayers.filter(p => p.id !== playerId);

    this.playersSubject.next(updatedPlayers);
  }

  // In game actions

  startGame() {
    const currentPlayers = this.currentPlayers.map(player => {
      player.isAlive = true;
      return player;
    });
    this.playersSubject.next(currentPlayers);
    this.setTurn(0);
    this.paintRandomZones();
  }

  nextTurn() {
    const currentPlayers = this.currentPlayers;
    let currentTurn = this.turnOfSubject.getValue();
    currentTurn++;
    if (currentTurn >= currentPlayers.length) {
      currentTurn = 0;
      this.roundSubject.next(this.roundSubject.getValue() + 1);
    }
    this.setTurn(currentTurn);

    this.paintRandomZones();
  }

  setTurn(playerIndex: number) {
    const currentPlayers = this.currentPlayers.map((player, index) => {
      player.currentTurn = index === playerIndex;
      return player;
    });
    this.playersSubject.next(currentPlayers);
    this.turnOfSubject.next(playerIndex);
  }

  /**
   * Llamamos zona al conjunto de un área (numero) y dos colores.
   * Pintamos zonas en la diana, cada zona tiene un numero y dos posibles colores aleatorios.
   * Si coincide el color que intentamos pintar en el área, se pinta en un solo color pero más intenso.
   * Si un área ya tiene dos colores intensos, no se vuelve a pintar (se elimina de availableAreas).
   * 
   * Ejemplo:
   * Si se intenta pinta un área de rojo, y ya estaba en rojo, el color1 será rojo intenso.
   * Si esa misma area se intenta pintar de azul, el color2 será azul, y la zona será de dos colores (rojo intenso y azul).
   */
  paintRandomZones() {
    this.cleanZones()
    const hitZones = 3;
    const healZones = 1;
    const colors = this.utilsService.getBoardDefaults().colors;
    let availableAreas = [...this.utilsService.getBoardDefaults().areas];
    let boardZones: BoardZone[] = [];

    function addZone(area: string, color: string, intenseColor: string) {
      let zone = boardZones.find(z => z.area === area);

      if (!zone) {
        boardZones.push({ area: area, color1: color });
      } else if (!zone.color2) {
        // Si el color ya está, intensifica, si no, añade segundo color
        if (zone.color1 === color) {
          zone.color1 = intenseColor;
        } else {
          zone.color2 = color;
        }
      } else {
        // Si ambos colores están y uno coincide, intensifica
        if (zone.color1 === color) zone.color1 = intenseColor;
        if (zone.color2 === color) zone.color2 = intenseColor;
      }

      // Si ambos colores son intensos, elimina de disponibles
      if (zone && zone.color1 === intenseColor && zone.color2 === intenseColor) {
        availableAreas = availableAreas.filter(a => a !== area);
      }
    }

    // Pintar zonas de daño
    for (let i = 0; i < hitZones && availableAreas.length > 0; i++) {
      const area = availableAreas[Math.floor(Math.random() * availableAreas.length)];
      addZone(area, colors.hit, colors.hit2);
    }

    // Pintar zonas de curación
    for (let i = 0; i < healZones && availableAreas.length > 0; i++) {
      const area = availableAreas[Math.floor(Math.random() * availableAreas.length)];
      addZone(area, colors.heal, colors.heal2);
    }

    this.boardZonesSubject.next(boardZones);
  }

  cleanZones() {
    this.boardZonesSubject.next([]);
  }
}

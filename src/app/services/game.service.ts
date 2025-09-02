import { Injectable } from '@angular/core';
import { Player } from '../interfaces/player';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from './utils.service';
import { BoardZone } from '../interfaces/board-zone';
import { InfoDartboardService } from './info-dartboard.service';
import { InfoDamage } from '../interfaces/info-damage';

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

  showPlayersHealthActionsSubject = new BehaviorSubject<boolean>(false);
  showActions$ = this.showPlayersHealthActionsSubject.asObservable();

  get boardZones(): BoardZone[] {
    return this.boardZonesSubject.getValue();
  }

  constructor(private utilsService: UtilsService, private infoDartboardService: InfoDartboardService) { }

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
      // console.log('Player modified:', player);
    } else {
      // console.error('Player not found:', player);
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
      player.hp$.next(this.utilsService.maxHealth);
      return player;
    });
    this.playersSubject.next(currentPlayers);
    this.roundSubject.next(0);
    this.setTurn(0);
    this.togglePlayersHealthActions(false);
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
  }

  setTurn(playerIndex: number) {
    const currentPlayers = this.currentPlayers.map((player, index) => {
      player.currentTurn = index === playerIndex;
      return player;
    });
    this.playersSubject.next(currentPlayers);
    this.turnOfSubject.next(playerIndex);

    // reiniciamos los lanzamientos
    this.infoDartboardService.resetThrows();

    // generamos zonas para jugadores
    const playerZones = this.setZonesForPlayers();
    // pintamos en la diana según esas zonas
    this.paintZonesFromPlayers(playerZones);
  }

  /**
   * Genera zonas individuales para cada jugador (curación o daño).
   * Devuelve un array con todas las zonas generadas (para pintarlas en la diana).
   */
  setZonesForPlayers(): { area: string, type: 'damage' | 'heal' }[] {
    const players = this.currentPlayers;
    const allZones: { area: string, type: 'damage' | 'heal' }[] = [];

    const availableAreas = [...this.utilsService.getBoardDefaults().areas];

    players.filter(p => p.isAlive).forEach(player => {
      player.healPoints = [];
      player.weakPoints = [];

      if (player.currentTurn) {
        // 🎯 jugador en turno → obtiene 1 zona de curación
        const healArea = availableAreas[Math.floor(Math.random() * availableAreas.length)];
        player.healPoints.push(Number(healArea));
        allZones.push({ area: healArea, type: 'heal' });
      } else {
        // 🎯 rivales → obtienen 3 zonas de daño
        for (let i = 0; i < 3; i++) {
          const damageArea = availableAreas[Math.floor(Math.random() * availableAreas.length)];
          player.weakPoints.push(Number(damageArea));
          allZones.push({ area: damageArea, type: 'damage' });
        }
      }
    });

    this.playersSubject.next(players);
    return allZones;
  }

  /**
  * Pinta en la diana las zonas recibidas (acumuladas de todos los jugadores).
  */
  paintZonesFromPlayers(playerZones: { area: string, type: 'damage' | 'heal' }[]) {
    this.cleanZones();
    const colors = this.utilsService.getBoardDefaults().colors;
    let boardZones: BoardZone[] = [];

    function addZone(area: string, color: string, intenseColor: string, type: 'damage' | 'heal') {
      let zone = boardZones.find(z => z.area === area);

      if (!zone) {
        // primera vez
        boardZones.push({ area, color1: color, [type]: 1 });
      } else {
        // inicializa contador
        zone[type] = (zone[type] ?? 0) + 1;

        // intensificar colores
        if (zone.color1 === color) {
          zone.color1 = intenseColor;
        } else if (!zone.color2) {
          zone.color2 = color;
        } else {
          if (zone.color1 === color) zone.color1 = intenseColor;
          if (zone.color2 === color) zone.color2 = intenseColor;
        }
      }
    }

    // recorrer todas las zonas generadas
    playerZones.forEach(z => {
      if (z.type === 'damage') {
        addZone(z.area, colors.hit, colors.hit2, 'damage');
      } else {
        addZone(z.area, colors.heal, colors.heal2, 'heal');
      }
    });

    this.boardZonesSubject.next(boardZones);
  }

  cleanZones() {
    this.boardZonesSubject.next([]);
  }

  hitPlayer(player: Player, points: number) {
    const currentHp = player.hp$.getValue();
    if(!currentHp) return;

    let damage = currentHp - points;
    if(damage < 0) {
      damage = 0;
      // player.isAlive = false; // ! hacer que isAlive sea un observable?
    }
    player.hp$.next(damage);
  }

  healPlayer(player: Player, points: number) {
    const currentHp = player.hp$.getValue();
    if(!currentHp) return;

    let healed = currentHp + points;
    if(healed > this.utilsService.maxHealth) healed = this.utilsService.maxHealth;
    player.hp$.next(healed);
  }

  // aplicamos el turno, es decir, el daño que hemos generado etc
  applyThrows(damages: InfoDamage[], heal: number) { // ! aplicar el out a sí mismo como si fuese su área asignada?
    console.log('Apply', damages);
    let currentTurnPlayer = this.currentPlayers.find(p => p.currentTurn);
    // ! meter una animación o algo?
    if(damages.length) {
      damages.forEach((damageInfo) => {
        let player = this.currentPlayers.find(p => p.id === damageInfo.id);
        if(player) this.hitPlayer(player, damageInfo.damage);
      });
    }
    if(currentTurnPlayer && heal) this.healPlayer(currentTurnPlayer, heal);
  }

  togglePlayersHealthActions(value?: boolean) {
    if(value != null) this.showPlayersHealthActionsSubject.next(value);
    else this.showPlayersHealthActionsSubject.next(!this.showPlayersHealthActionsSubject.getValue());
  }
}

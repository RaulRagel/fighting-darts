import { Injectable } from '@angular/core';
import { Player } from '../interfaces/player';
import { BehaviorSubject, Subject } from 'rxjs';
import { UtilsService } from './utils.service';
import { BoardZone } from '../interfaces/board-zone';
import { InfoDartboardService } from './info-dartboard.service';
import { InfoDamage } from '../interfaces/info-damage';
import { ConfigService } from './config.service';

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

  // Animaciones de números flotantes
  damageHealSubject = new Subject<{ playerId: number; amount: number; type: 'damage' | 'heal' }>();
  damageHeal$ = this.damageHealSubject.asObservable();

  winnerSubject = new BehaviorSubject<Player | null>(null);
  winner$ = this.winnerSubject.asObservable();

  get boardZones(): BoardZone[] {
    return this.boardZonesSubject.getValue();
  }

  constructor(private utilsService: UtilsService, private infoDartboardService: InfoDartboardService, private configService: ConfigService) { }

  get currentPlayers(): Player[] {
    return this.playersSubject.getValue();
  }

  get alivePlayers(): Player[] {
    return this.currentPlayers.filter(p => p.isAlive);
  }

  get currentTurnPlayer(): Player | undefined {
    return this.currentPlayers.find(p => p.currentTurn);
  }

  // In edit mode actions

  addNewPlayer(params: Partial<Player> = {}) {
    const currentPlayers = this.currentPlayers;
    // Calcular next createdIndex (basado en el máximo actual para evitar colisiones si se eliminaron jugadores)
    const maxIndex = currentPlayers.length ? Math.max(...currentPlayers.map(p => p.createdIndex ?? -1)) : -1;
    const nextCreatedIndex = maxIndex + 1;

    this.playersSubject.next([...currentPlayers, {
      id: new Date().getTime() + currentPlayers.length,
      name: params.name?.trim() || this.defaultPlayerName(),
      isAlive: true,
      color: '#797979',
      background: this.utilsService.parseBackgroundColor('#797979'),
      fighterGif: this.utilsService.parseFighterGif(1),
      skill: { name: 'Ninguna'},
      hp$: new BehaviorSubject<number>(this.utilsService.maxHealth),
      createdIndex: nextCreatedIndex
    }]);
  }

  private defaultPlayerName() {
    const currentNames = this.currentPlayers.map(p => p.name);
    const name = this.utilsService.defaultName;
    let idx = 1;
    while(currentNames.includes(name+idx)) {
      idx++;
    }
    return name+idx;
  }

  modifyPlayer(player: Player) {
    const currentPlayers = this.currentPlayers;
    const index = currentPlayers.findIndex(p => p.id === player.id);

    if (index !== -1) {
      if(!player.name.trim()) player.name = this.defaultPlayerName();
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
    // limpiar ganador/confeti al iniciar una nueva partida
    this.winnerSubject.next(null);

    let currentPlayers = this.currentPlayers.map(player => {
      player.isAlive = true;
      player.hp$.next(this.utilsService.maxHealth);
      return player;
    });

    // Aplicar orden aleatorio o mantener orden de creación
    if (this.configService.randomPlayerOrder) {
      currentPlayers = this.utilsService.shufflePlayers(currentPlayers);
    } else {
      currentPlayers = this.utilsService.orderPlayers(currentPlayers);
    }

    this.playersSubject.next(currentPlayers);
    this.setRound(1);
    this.setTurn(0);
    this.togglePlayersHealthActions(false);
  }

  nextTurn() {
    const currentPlayers = this.currentPlayers;
    const alivePlayers = currentPlayers.filter(p => p.isAlive);
    
    // Si hay 1 o menos vivos, el juego terminó
    if(alivePlayers.length <= 1) {
      return;
    }
    
    let currentTurn = this.turnOfSubject.getValue();
    currentTurn++;
    if (currentTurn >= currentPlayers.length) {
      currentTurn = 0;
      this.nextRound();
    }
    
    // Si el siguiente jugador está muerto, buscar el siguiente vivo
    while(!currentPlayers[currentTurn].isAlive && alivePlayers.length > 1) {
      currentTurn++;
      if (currentTurn >= currentPlayers.length) {
        currentTurn = 0;
        this.nextRound();
      }
    }
    
    this.setTurn(currentTurn);
  }

  setTurn(playerIndex: number) {
    const currentPlayers = this.currentPlayers;
    const alivePlayers = currentPlayers.filter(p => p.isAlive);
    
    // Limpiar tags de todos
    currentPlayers.forEach((player) => {
      player.currentTurn = false;
      if(player.tag?.title !== 'Muerto' && player.tag?.title !== 'Ganador') {
        player.tag = undefined;
      }
    });
    
    // Establecer turno al jugador
    if(currentPlayers[playerIndex]) {
      currentPlayers[playerIndex].currentTurn = true;
      // Solo mostrar tag "Tu turno" si hay más de 1 jugador vivo
      if(currentPlayers[playerIndex].isAlive && alivePlayers.length > 1) {
        currentPlayers[playerIndex].tag = { title: 'Tu turno', color: '#d3b411' };
      }
    }
    
    this.playersSubject.next(currentPlayers);
    this.turnOfSubject.next(playerIndex);

    // reiniciamos los lanzamientos
    this.infoDartboardService.resetThrows();

    // generamos zonas para jugadores
    const playerZones = this.setZonesForPlayers();
    // pintamos en la diana según esas zonas
    this.paintZonesFromPlayers(playerZones);
  }

  nextRound() {
    let currentRound = this.roundSubject.getValue();
    currentRound++;
    this.roundSubject.next(currentRound);
  }

  setRound(roundNumber: number) {
    this.roundSubject.next(roundNumber);
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
      player.healAreas = [];
      player.weakAreas = [];

      if (player.currentTurn) {
        // 🎯 jugador en turno → obtiene 1 zona de curación
        const healArea = availableAreas[Math.floor(Math.random() * availableAreas.length)];
        player.healAreas.push(Number(healArea));
        allZones.push({ area: healArea, type: 'heal' });
      } else {
        // 🎯 rivales → obtienen 3 zonas de daño
        for (let i = 0; i < 3; i++) {
          const damageArea = availableAreas[Math.floor(Math.random() * availableAreas.length)];
          player.weakAreas.push(Number(damageArea));
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
    // Si ya hay un ganador, no aplicar más daño
    if (this.winnerSubject.getValue()) return;

    const currentHp = player.hp$.getValue();
    if(!currentHp) return;

    let damage = currentHp - points;
    if(damage < 0) {
      damage = 0;
    }
    player.hp$.next(damage);
    
    // Marcar como muerto si HP llega a 0
    if(damage === 0) {
      player.isAlive = false;
      player.tag = { title: 'Muerto', color: '#ff4e50' };
      this.playersSubject.next([...this.currentPlayers]);
      
      // Verificar si hay ganador
      const alivePlayers = this.currentPlayers.filter(p => p.isAlive);
      if(alivePlayers.length === 1) {
        alivePlayers[0].tag = { title: 'Ganador', color: '#38ef7d' };
        this.winnerSubject.next(alivePlayers[0]);
        this.playersSubject.next([...this.currentPlayers]);
      }
    }
    
    this.damageHealSubject.next({ playerId: player.id, amount: points, type: 'damage' });
  }

  healPlayer(player: Player, points: number) {
    // Si ya hay un ganador, no aplicar curaciones
    if (this.winnerSubject.getValue()) return;

    const currentHp = player.hp$.getValue();
    if(!currentHp) return;

    let healed = currentHp + points;
    if(healed > this.utilsService.maxHealth) healed = this.utilsService.maxHealth;
    player.hp$.next(healed);
    this.damageHealSubject.next({ playerId: player.id, amount: points, type: 'heal' });
  }

  // aplicamos el turno, es decir, el daño que hemos generado etc
  applyThrows(damages: InfoDamage[], heal: number, autoDamage: number) {
    console.log('Apply', damages);
    let currentTurnPlayer = this.currentTurnPlayer;
    if(damages.length) {
      damages.forEach((damageInfo) => {
        let player = this.currentPlayers.find(p => p.id === damageInfo.id);
        if(player) this.hitPlayer(player, damageInfo.damage);
      });
    }
    if(currentTurnPlayer) {
      const netEffect = heal - autoDamage;
      if(netEffect > 0) {
        this.healPlayer(currentTurnPlayer, netEffect);
      } else if(netEffect < 0) {
        this.hitPlayer(currentTurnPlayer, Math.abs(netEffect));
      }
    }
    this.nextTurn();
  }

  togglePlayersHealthActions(value?: boolean) {
    if(value != null) this.showPlayersHealthActionsSubject.next(value);
    else this.showPlayersHealthActionsSubject.next(!this.showPlayersHealthActionsSubject.getValue());
  }
}

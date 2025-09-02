import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InfoDamage } from 'src/app/interfaces/info-damage';
import { ThrowInfo } from 'src/app/interfaces/throw';
import { GameService } from 'src/app/services/game.service';
import { InfoDartboardService } from 'src/app/services/info-dartboard.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-throws',
  templateUrl: './throws.component.html',
  styleUrls: ['./throws.component.scss']
})
export class ThrowsComponent implements OnInit {

  throwInfo: ThrowInfo[] = [];
  totalThrows: number = 0;

  healToPlayer: number = 0; // lo que se cura el turno actual
  damagesToPlayers: InfoDamage[] = []; // daño al resto de jugadores

  @Output() confirmTurnEmiter = new EventEmitter<void>();

  constructor(
    private infoDartboardService: InfoDartboardService,
    private gameService: GameService,
    private utilsService: UtilsService
  ) { }

  get outName() {
    return this.utilsService.outName;
  }

  ngOnInit(): void {
    this.infoDartboardService.throwInfo$
    .pipe()
    .subscribe(
      (throwInfo) => {
        console.log('throwInfo$ changed', throwInfo);
        this.throwInfo = throwInfo;
        this.totalThrows = throwInfo.reduce((acc, area) => acc + area.hits, 0);
        this.updatePlayerHeal();
        this.updateDamageToPlayer();
      }
    );
  }

  removeLastDart() {
    this.infoDartboardService.removeDart();
  }

  private updatePlayerHeal() {
    let damageZones = this.gameService.boardZones;
    let heal = 0;
    for(let throwInfo of this.throwInfo) {
      let zone = damageZones.find(z => z.area === throwInfo.area);
      if(zone?.heal) {
        heal += (zone.heal * throwInfo.value);
      }
      if(throwInfo.area === this.utilsService.bullName) {
        heal += throwInfo.value;
      }
    }
    this.healToPlayer = heal;
  }

  private updateDamageToPlayer() { // ! agregar el out?
    let players = this.gameService.currentPlayers.filter(p => p.isAlive && !p.currentTurn);
    this.damagesToPlayers = [];

    players.forEach(player => {
      let weakPoints = player.weakPoints;
      if(weakPoints) {
        let damage = 0;
        this.throwInfo.forEach(thrw => {
          if(thrw.area === this.utilsService.bullName) damage += thrw.value;
          weakPoints?.forEach(wp => {
            if(wp === Number(thrw.area)) damage += thrw.value;
          });
        });
        if(damage) this.damagesToPlayers.push({
          id: player.id,
          playerName: player.name,
          damage: damage
        });
      }
    });
  }

  isSuccessThrow(area: string): boolean {
    if(area === this.utilsService.bullName) return true;
    return this.gameService.boardZones.some(zone => zone.area === area);
  }

  getZoneStyle(area: string) {
    const zone = this.gameService.boardZones.find(z => z.area === area);
    let style: any = {};
    if(zone) {
      style.background = zone.color1;
      style.color = 'white';
      if(zone.color2) style.background = `linear-gradient(90deg, ${zone.color1} 0%, ${zone.color2} 100%)`;
    }
    if(area === this.utilsService.bullName) {
      let {hit, heal} = this.utilsService.getBoardDefaults().colors;
      style.color = 'white';
      style.background = `linear-gradient(90deg, ${hit} 0%, ${heal} 100%)`;
    }
    return style;
  }

  confirmTurn() {
    // al confirmar turno, aplicamos los daños a los jugadores, reiniciamos los lanzamientos y cerramos la diana
    this.gameService.applyThrows(this.damagesToPlayers, this.healToPlayer);
    this.infoDartboardService.resetThrows();
    this.confirmTurnEmiter.emit();
  }

}

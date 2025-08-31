import { Component, OnInit } from '@angular/core';
import { ThrowInfo } from 'src/app/interfaces/throw';
import { GameService } from 'src/app/services/game.service';
import { InfoDartboardService } from 'src/app/services/info-dartboard.service';
import { UtilsService } from 'src/app/services/utils.service';

interface InfoDamage {
  playerName: string,
  id: number,
  damage: number
}

@Component({
  selector: 'app-throws',
  templateUrl: './throws.component.html',
  styleUrls: ['./throws.component.scss']
})
export class ThrowsComponent implements OnInit {

  throwInfo: ThrowInfo[] = [];
  totalThrows: number = 0;

  damage: number = 0;
  health: number = 0;
  damagesToPlayers: any[] = [];

  constructor(private infoService: InfoDartboardService, private gameService: GameService, private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.infoService.throwInfo$
    .pipe()
    .subscribe(
      (throwInfo) => {
        console.log('throwInfo$ changed', throwInfo);
        this.throwInfo = throwInfo;
        this.totalThrows = throwInfo.reduce((acc, area) => acc + area.hits, 0);
        this.updateDamageAndHealth();
        this.updateDamageToPlayer();
      }
    );
  }

  removeLastDart() {
    this.infoService.removeDart();
  }

  private updateDamageAndHealth() { // ! mover logica al service? esto irá por cada jugador
    console.log('players', this.gameService.currentPlayers);
    // obetenemos las zonas donde se puede hacer daño o curar
    let damageZones = this.gameService.boardZones;
    // por cada area en throwInfo, buscamos si existe en damageZones
    this.damage = 0;
    this.health = 0;
    for(let throwInfo of this.throwInfo) {
      let zone = damageZones.find(z => z.area === throwInfo.area);
      if(zone) {
        if(zone.damage) this.damage += (zone.damage * throwInfo.value);
        if(zone.heal) this.health += (zone.heal * throwInfo.value);
      }
      if(throwInfo.area === this.utilsService.bullName) {
        this.damage += throwInfo.value;
        this.health += throwInfo.value;
      }
    }
    console.log('Total damage:', this.damage, 'Total health:', this.health);
  }

  private updatePlayerHeal() { // ! con esta función parecida a la de abajo, la de arriba no haría falta, ni damage tampoco

  }

  private updateDamageToPlayer() {
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
          name: player.name,
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

}

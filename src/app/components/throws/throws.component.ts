import { Component, OnInit } from '@angular/core';
import { ThrowInfo } from 'src/app/interfaces/throw';
import { GameService } from 'src/app/services/game.service';
import { InfoDartboardService } from 'src/app/services/info-dartboard.service';

@Component({
  selector: 'app-throws',
  templateUrl: './throws.component.html',
  styleUrls: ['./throws.component.scss']
})
export class ThrowsComponent implements OnInit {

  throwInfo: ThrowInfo[] = [];
  damage: number = 0;
  health: number = 0;
  totalThrows: number = 0;

  constructor(private infoService: InfoDartboardService, private gameService: GameService) { }

  ngOnInit(): void {
    this.infoService.throwInfo$
    .pipe()
    .subscribe(
      (throwInfo) => {
        console.log('throwInfo$ changed', throwInfo);
        this.throwInfo = throwInfo;
        this.totalThrows = throwInfo.reduce((acc, area) => acc + area.hits, 0);
        this.updateDamageAndHealth(this.throwInfo);
      }
    );
  }

  removeLastDart() {
    this.infoService.removeDart();
  }

  updateDamageAndHealth(throwsInfo: ThrowInfo[]) { // ! mover logica al service?
    // obetenemos las zonas donde se puede hacer daño o curar
    let damageZones = this.gameService.boardZones;
    // por cada area en throwInfo, buscamos si existe en damageZones
    this.damage = 0;
    this.health = 0;
    for(let throwInfo of throwsInfo) {
      let zone = damageZones.find(z => z.area === throwInfo.area);
      if(zone) {
        if(zone.damage) this.damage += (zone.damage * throwInfo.value);
        if(zone.health) this.health += (zone.health * throwInfo.value);
      }
    }
    console.log('Total damage:', this.damage, 'Total health:', this.health);
  }

  isSuccessThrow(area: string): boolean {
    return this.gameService.boardZones.some(zone => zone.area === area);
  }

  getZoneClass(area: string) {
    console.log('this.gameService.boardZones', this.gameService.boardZones);
    const zone = this.gameService.boardZones.find(z => z.area === area);
    return zone ? 'success' : '';
  }

}

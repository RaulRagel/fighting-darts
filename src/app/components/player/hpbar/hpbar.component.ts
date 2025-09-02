import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-hpbar',
  templateUrl: './hpbar.component.html',
  styleUrls: ['./hpbar.component.scss']
})
export class HpbarComponent implements OnInit {

  @Input() hp$!: BehaviorSubject<number> | undefined;
  private sub!: Subscription;
  hp: number = 0;

  get hpArray(): number[] {
    return Array(this.hp).fill(0);
  }

  get totalPlayers() {
    return this.gameService.currentPlayers.length;
  }

  constructor(private gameService: GameService) { }

  ngOnInit() {
    if(this.hp$) this.sub = this.hp$.subscribe(val => this.hp = val);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';

interface DamageHealEvent {
  playerId: number;
  amount: number;
  type: 'damage' | 'heal';
  id: string;
}

@Component({
  selector: 'app-hpbar',
  templateUrl: './hpbar.component.html',
  styleUrls: ['./hpbar.component.scss']
})
export class HpbarComponent implements OnInit, OnDestroy {

  @Input() hp$!: BehaviorSubject<number> | undefined;
  @Input() playerId!: number;
  
  private sub!: Subscription;
  private damageHealSub!: Subscription;
  hp: number = 0;
  
  activeNumbers: DamageHealEvent[] = [];

  get hpArray(): number[] {
    return Array(this.hp).fill(0);
  }

  get totalPlayers() {
    return this.gameService.currentPlayers.length;
  }

  constructor(private gameService: GameService) { }

  ngOnInit() {
    if(this.hp$) this.sub = this.hp$.subscribe(val => this.hp = val);
    
    // Escuchar eventos de daño/curación para las animaciones de números flotantes
    this.damageHealSub = this.gameService.damageHeal$.subscribe(event => {
      if(event.playerId === this.playerId) {
        const newEvent: DamageHealEvent = {
          ...event,
          id: `${event.playerId}-${Date.now()}-${Math.random()}`
        };
        this.activeNumbers.push(newEvent);

        // Remover después de 1 segundo (duración de la animación)
        setTimeout(() => {
          this.activeNumbers = this.activeNumbers.filter(n => n.id !== newEvent.id);
        }, 2000);
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.damageHealSub?.unsubscribe();
  }

}

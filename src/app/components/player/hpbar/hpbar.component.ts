import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

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

  constructor() { }

  ngOnInit() {
    if(this.hp$) this.sub = this.hp$.subscribe(val => this.hp = val);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

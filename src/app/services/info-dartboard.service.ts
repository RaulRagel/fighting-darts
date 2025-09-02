import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThrowInfo } from '../interfaces/throw';
import { UtilsService } from './utils.service';

const VALUES: { [key: string]: number } = {
  s: 1,
  d: 2,
  t: 3,
  outer: 1, // 1 a todos
  bull: 3, // 3 a todos
  out: -1 // daño al jugador
}

@Injectable({
  providedIn: 'root'
})
export class InfoDartboardService {

  throws$ = new BehaviorSubject<string[]>([]);
  throwInfo$ = new BehaviorSubject<ThrowInfo[]>([]);

  constructor(private utilsService: UtilsService) { }

  init() {
    this.throws$
    .pipe()
    .subscribe(
      throws => {
        // console.log('throws$ changed, update info', throws);
        this.updateThrows(throws);
      }
    );
  }

  addDart(id: string) {
    let throws: string[] = this.throws$.value;
    throws.push(id);
    this.throws$.next(throws);
    console.log('added dart', throws);
  }

  removeDart() {
    let throws: string[] = this.throws$.value;
    throws.pop();
    this.throws$.next(throws);
  }

  resetThrows() { // al pasar de turno (o confirmarlo), limpiamos los throws
    this.throws$.next([]);
  }

  private updateThrows(throws: string[]) { // privado porque solo debe actualizarse si se actualizan los throws
    let duplicatedThrow;
    let throwInfo: ThrowInfo[] = [];

    for(let currentThrow of throws) {
      duplicatedThrow = throwInfo.find(d => d.area === this.getThrowName(currentThrow));
      if(duplicatedThrow) {
        duplicatedThrow.hits++;
        duplicatedThrow.value += this.getThrowValue(currentThrow);
      } else {
        debugger;
        throwInfo.push({
          area: this.getThrowName(currentThrow),
          hits: 1,
          value: this.getThrowValue(currentThrow)
        });
      }
    }

    console.log('throwInfo$.next');
    this.throwInfo$.next(throwInfo);
  }

  getThrowName(id: string): string {
    if (!id) return '';
    if(id === 'out') return this.utilsService.outName;
    if(['bull', 'outer'].includes(id)) return this.utilsService.bullName;
    
    return id.slice(1);
  }

  getThrowValue(id: string): number {
    if (!id) return 0;
    if(id === 'out') return VALUES[id];
    if(['bull', 'outer'].includes(id)) return VALUES[id];
    
    return VALUES[id[0]];
  }
}

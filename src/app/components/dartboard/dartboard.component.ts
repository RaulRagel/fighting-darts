import { Component, OnInit } from '@angular/core';

interface Throw {
  // id: string,
  hits: number,
  name: string
  value: number // valor de la tirada (s: x1, d: x2, t: x3)
}

const VALUES: { [key: string]: number } = {
  s: 1,
  d: 2,
  t: 3,
  outer: 1, // 1 a todos
  bull: 3 // 3 a todos
}

@Component({
  selector: 'app-dartboard',
  templateUrl: './dartboard.component.html',
  styleUrls: ['./dartboard.component.css'],
})
export class DartBoardComponent implements OnInit {

  dartboardSections!: NodeList;
  throws: string[] = [];
  throwInfo: Throw[] = [];
  totalPoints: number[] = [];

  constructor() {
    
  }

  ngOnInit(): void {

    this.dartboardSections = document.querySelectorAll('#dartboard #areas g path, #dartboard #areas g circle');
    console.log('init boardSections', this.dartboardSections);

    this.dartboardSections.forEach(p =>
      p.addEventListener('click', (event) => this.boardClickHandler(event)) // evitamos perder el contexto
    );
  }

  boardClickHandler(event: any) {
    this.addDart(event.target.getAttribute('id'));
  }

  addDart(id: string) {
    this.throws.push(id);
    console.log('added dart', this.throws);
    this.updateInfo();
  }

  removeDart() {
    this.throws.pop();
    this.updateInfo();
  }

  updateInfo() {
    this.updateThrows();
  }

  updateThrows() {
    let duplicatedThrow;
    let throwInfo: Throw[] = [];

    for(let currentThrow of this.throws) {
      duplicatedThrow = throwInfo.find(d => d.name === this.getThrowName(currentThrow));
      if(duplicatedThrow) {
        duplicatedThrow.hits++;
        duplicatedThrow.value += this.getThrowValue(currentThrow);
      } else {
        throwInfo.push({
          name: this.getThrowName(currentThrow),
          hits: 1,
          value: this.getThrowValue(currentThrow)
        });
      }
    }

    this.throwInfo = throwInfo;

    console.log('throwInfo', this.throwInfo);
  }

  getThrowName(id: string): string {
    if (!id) return '';
    if(['bull', 'outer'].includes(id)) return 'Centro';
    
    return id.slice(1);
  }

  getThrowValue(id: string): number {
    if (!id) return 0;
    if(['bull', 'outer'].includes(id)) return VALUES[id];
    
    return VALUES[id[0]];
  }
    
}


// Id áreas:
// <s/d/t><num> (Ej: single 20 -> s20, triple 19 -> t19, doble 6 -> d6)
// Centro: bull, outer
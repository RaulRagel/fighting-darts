import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dartboard',
  templateUrl: './dartboard.component.html',
  styleUrls: ['./dartboard.component.css'],
})
export class DartBoardComponent implements OnInit {

  throws: String[] = [];
  dartboardSections!: NodeList;

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
  }

  // getDartValueFromID(id: string) {
  //   if (!id) return 0;
    
  //   if (id == 'Bull') return 50;
  //   if (id == 'Outer') return 25;
    
  //   let mod = 0;
  //   switch(id[0]) {
  //       case 's': mod = 1; break;
  //       case 'd': mod = 2; break;
  //       case 't': mod = 3; break;
  //       default: mod = 1;
  //   }
    
  //   return mod * parseInt(id.slice(1));
  // }
    
}


// Id áreas:
// <s/d/t><num> (Ej: single 20 -> s20, triple 19 -> t19, doble 6 -> d6)
// Centro: Bull, Outer
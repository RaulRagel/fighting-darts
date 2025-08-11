import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dartboard',
  templateUrl: './dartboard.component.html',
  styleUrls: ['./dartboard.component.css'],
})
export class DartBoardComponent implements OnInit {

  // throws: Array[] = 

  constructor() {
    
  }

  ngOnInit(): void {
    
  }
}


// Id áreas:
// <s/d/t><num> (Ej: single 20 -> s20, triple 19 -> t19, doble 6 -> d6)
// Centro: Bull, Outer
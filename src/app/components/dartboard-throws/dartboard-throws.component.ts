import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dartboard-throws',
  templateUrl: './dartboard-throws.component.html',
  styleUrls: ['./dartboard-throws.component.scss']
})
export class DartboardThrowsComponent implements OnInit {

  show = true; // ! esta valor cambiará a false cuando la info de la diana esté oculta

  constructor() { }

  ngOnInit(): void {
  }

}

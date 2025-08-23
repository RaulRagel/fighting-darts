import { Component, Input, OnInit } from '@angular/core';
import { GenericButton } from 'src/app/interfaces/generic-button';

@Component({
  selector: 'app-generic-button',
  templateUrl: './generic-button.component.html',
  styleUrls: ['./generic-button.component.scss']
})
export class GenericButtonComponent implements OnInit {

  @Input() button!: GenericButton;

  SIZES = {
    big: 'big'
  }

  constructor() { }

  ngOnInit(): void {
  }

  onClick() {
    this.button.action();
  }

}

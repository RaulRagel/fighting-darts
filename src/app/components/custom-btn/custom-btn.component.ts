import { Component, Input, OnInit } from '@angular/core';
import { MenuButton } from 'src/app/interfaces/menu-button';

@Component({
  selector: 'app-custom-btn',
  templateUrl: './custom-btn.component.html',
  styleUrls: ['./custom-btn.component.scss']
})
export class CustomBtnComponent implements OnInit {

  @Input() button!: MenuButton;
  @Input() disabled: boolean = false;

  constructor() {

  }

  ngOnInit(): void {
    // console.log('CustomBtnComponent initialized with button:', this.button);
  }

  onClick() {
    if (this.button.action) this.button.action();
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dartboard-throws',
  templateUrl: './dartboard-throws.component.html',
  styleUrls: ['./dartboard-throws.component.scss']
})
export class DartboardThrowsComponent implements OnInit {

  // closeDartboard
  @Output() closeDartboard = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  close() {
    this.closeDartboard.emit();
  }
}

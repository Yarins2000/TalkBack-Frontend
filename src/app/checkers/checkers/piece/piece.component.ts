import { Component, Input } from '@angular/core';
import { CheckerState } from '../../models/CheckerState.model';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class PieceComponent {
  @Input() color: CheckerState = CheckerState.Empty;

  get checkerState() {
    switch (this.color) {
      case CheckerState.Black:
        return 'black-piece';
      case CheckerState.White:
        return 'white-piece';
      default:
        return '';
    }
  }
}

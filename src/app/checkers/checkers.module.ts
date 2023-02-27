import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckersComponent } from './checkers/checkers.component';
import { PieceComponent } from './checkers/piece/piece.component';


@NgModule({
  declarations: [
    CheckersComponent,
    PieceComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CheckersComponent
  ]
})
export class CheckersModule { }

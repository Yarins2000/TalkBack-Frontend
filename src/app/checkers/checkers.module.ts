import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckersComponent } from './checkers/checkers.component';
import { PieceComponent } from './checkers/piece/piece.component';
import { CheckersRoutingModule } from './checkers-routing.module';
import { ToastsContainer } from "../toast/toasts-container.component";

@NgModule({
    declarations: [
        CheckersComponent,
        PieceComponent
    ],
    exports: [
        CheckersComponent,
        CheckersRoutingModule
    ],
    imports: [
        CommonModule,
        ToastsContainer
    ]
})
export class CheckersModule { }

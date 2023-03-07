import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateGuard } from '../guards/authenticate.guard';
import { CheckersComponent } from './checkers/checkers.component';

const routes: Routes = [
  {path: '', canActivate:[AuthenticateGuard], component:CheckersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckersRoutingModule { }

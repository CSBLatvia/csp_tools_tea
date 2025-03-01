import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TerritoryViewComponent} from "../view-territory/territory-view.component";

const routes: Routes = [
  {path: '',component: TerritoryViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerritoryRoutingModule { }

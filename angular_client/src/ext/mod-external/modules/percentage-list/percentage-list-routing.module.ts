import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ViewPercentageListComponent} from "../../views/view-percentage-list/view-percentage-list.component";

const routes: Routes = [
  {path: '',component: ViewPercentageListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PercentageListRoutingModule { }

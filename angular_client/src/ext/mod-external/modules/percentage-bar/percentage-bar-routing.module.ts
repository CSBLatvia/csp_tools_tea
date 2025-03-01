import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ViewPercentageBarComponent} from "../../views/view-percentage-bar/view-percentage-bar.component";

const routes: Routes = [
  {path: '',component: ViewPercentageBarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PercentageBarRoutingModule { }

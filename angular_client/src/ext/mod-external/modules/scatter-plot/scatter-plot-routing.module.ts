import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ViewScatterPlotComponent} from "../../views/view-scatter-plot/view-scatter-plot.component";

const routes: Routes = [
  {path: '',component: ViewScatterPlotComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScatterPlotRoutingModule { }

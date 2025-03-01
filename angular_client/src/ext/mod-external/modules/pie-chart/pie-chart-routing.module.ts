import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ViewPieChartComponent} from "../../views/view-pie-chart/view-pie-chart.component";

const routes: Routes = [
  {path: '',component: ViewPieChartComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PieChartRoutingModule { }

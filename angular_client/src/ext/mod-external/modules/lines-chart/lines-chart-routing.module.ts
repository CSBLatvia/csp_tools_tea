import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompLinesChartComponent} from "../../components/comp-lines-chart/comp-lines-chart.component";
import {ViewLinesChartComponent} from "../../views/view-lines-chart/view-lines-chart.component";

const routes: Routes = [
  {path: '',component: ViewLinesChartComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinesChartRoutingModule { }

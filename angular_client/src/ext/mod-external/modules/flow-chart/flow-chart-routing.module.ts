import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ViewFlowChartComponent} from "../../views/view-flow-chart/view-flow-chart.component";

const routes: Routes = [
  {path: '',component: ViewFlowChartComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlowChartRoutingModule { }

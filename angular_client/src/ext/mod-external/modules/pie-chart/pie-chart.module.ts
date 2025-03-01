import { NgModule } from '@angular/core';
import { PieChartRoutingModule } from './pie-chart-routing.module';
import {CompPieChartComponent} from "../../components/comp-pie-chart/comp-pie-chart.component";
import {SharedExternalCompModule} from "../shared-external-comp.module";
import {ViewPieChartComponent} from "../../views/view-pie-chart/view-pie-chart.component";
import {FlowChartModule} from "../flow-chart/flow-chart.module";



@NgModule({
  declarations: [
    CompPieChartComponent,ViewPieChartComponent
  ],
    imports: [
        SharedExternalCompModule,
        PieChartRoutingModule,
        FlowChartModule
    ],
    exports: [
        ViewPieChartComponent,
        CompPieChartComponent
    ],
  providers:[]
})
export class PieChartModule { }

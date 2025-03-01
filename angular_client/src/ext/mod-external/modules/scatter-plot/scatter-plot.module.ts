import { NgModule } from '@angular/core';
import { ScatterPlotRoutingModule } from './scatter-plot-routing.module';
import {CompScatterPlotComponent} from "../../components/comp-scatter-plot/comp-scatter-plot.component";
import {SharedExternalCompModule} from "../shared-external-comp.module";
import {ViewScatterPlotComponent} from "../../views/view-scatter-plot/view-scatter-plot.component";
import {FlowChartModule} from "../flow-chart/flow-chart.module";
import {UiControlsModule} from "../../../ui-controls/modules/ui-controls.module";


@NgModule({
  declarations: [
    CompScatterPlotComponent,ViewScatterPlotComponent
  ],
    imports: [
        SharedExternalCompModule,
        ScatterPlotRoutingModule,
        FlowChartModule,
        UiControlsModule
    ],
    exports: [
        ViewScatterPlotComponent,
        CompScatterPlotComponent
    ],
  providers:[]
})
export class ScatterPlotModule { }

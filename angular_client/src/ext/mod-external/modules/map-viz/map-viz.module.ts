import { NgModule } from '@angular/core';
import { MapVizRoutingModule } from './map-viz-routing.module';
import {CompMapVizComponent} from "../../components/comp-map-viz/comp-map-viz.component";
import {MapVizService} from "../../services/map-viz.service";
import {MapLegendService} from "./services/map-legend/map-legend.service";
import {MapCentroidsService} from "./services/map-centroids/map-centroids.service";
import {VizCirclesService} from "./services/viz-services/viz-circles.service";
import {VizCirclesRegionService} from "./services/viz-services/viz-circles-region.service";
import {VizCirclesSectorsService} from "./services/viz-services/viz-circles-sectors.service";
import {VizCirclesSectorsRegionService} from "./services/viz-services/viz-circles-sectors-region.service";
import {MapMapBoxComponent} from "./components/map-mapbox/map-mapbox.component";
import {VizMapComponent} from "./components/viz-map/viz-map.component";
import {VizCirclesUglyComponent} from "./components/viz/ugly/viz-circles-ugly/viz-circles-ugly.component";
import {
  VizCirclesSectorsUglyComponent
} from "./components/viz/ugly/viz-circles-sectors-ugly/viz-circles-sectors-ugly.component";
import {
  VizCirclesSectorsRegionUglyComponent
} from "./components/viz/ugly/viz-circles-sectors-region-ugly/viz-circles-sectors-region-ugly.component";
import {
  VizCirclesRegionUglyComponent
} from "./components/viz/ugly/viz-circles-region-ugly/viz-circles-region-ugly.component";
import {VizPickingComponent} from "./components/viz-picking/viz-picking.component";
import {MapLayersPopComponent} from "./components/map-layers-pop/map-layers-pop.component";
import {MapLegendPopComponent} from "./components/map-legend-pop/map-legend-pop.component";
import {LegendSizesComponent} from "./components/map-legend-pop/components/legend-sizes/legend-sizes.component";
import {LegendListComponent} from "./components/map-legend-pop/components/legend-list/legend-list.component";
import {
  LegendClustersVerticalComponent
} from "./components/map-legend-pop/components/legend-clusters-vertical/legend-clusters-vertical.component";
import {LegendCirclesComponent} from "./components/map-legend-pop/components/legend-circles/legend-circles.component";
import {MapNoDataInfoComponent} from "./components/map-no-data-info/map-no-data-info.component";
import {MapComponent} from "./components/map/map.component";
import {MapBackgroundChoroService} from "./services/map-bacground-choro/map-background-choro.service";
import {MapPopService} from "./services/map-pop/map-pop.service";
import {TitlesService} from "./services/titles/titles.service";
import {SharedExternalCompModule} from "../shared-external-comp.module";
import {AllPopModule} from "../../../modules/all-pop/all-pop.module";
import {MapTitleModule} from "../../../modules/map-title/map-title.module";
import {UiControlsModule} from "../../../ui-controls/modules/ui-controls.module";
import {ViewMapVizComponent} from "../../views/view-map-viz/view-map-viz.component";
import {FlowChartModule} from "../flow-chart/flow-chart.module";

@NgModule({
  declarations: [
    CompMapVizComponent,ViewMapVizComponent,

    MapComponent,
    MapMapBoxComponent,
    VizMapComponent,
    VizCirclesUglyComponent,
    VizCirclesSectorsUglyComponent,
    VizCirclesSectorsRegionUglyComponent,
    VizCirclesRegionUglyComponent,
    VizPickingComponent,

    MapLayersPopComponent,
    MapLegendPopComponent,
    LegendSizesComponent,
    LegendListComponent,
    LegendClustersVerticalComponent,
    LegendCirclesComponent,
    MapNoDataInfoComponent
    ////////////////////
  ],
    imports: [
        SharedExternalCompModule,
        AllPopModule, MapTitleModule,
        MapVizRoutingModule,
        UiControlsModule, FlowChartModule
    ],
    exports: [
        ViewMapVizComponent,
        CompMapVizComponent
    ],
  providers:[

    MapVizService,
    /////////////////
    MapLegendService,
    MapCentroidsService,

    VizCirclesService,
    VizCirclesRegionService,
    VizCirclesSectorsService,
    VizCirclesSectorsRegionService,

    MapBackgroundChoroService,
    MapCentroidsService,
    MapLegendService,
    MapPopService,
    TitlesService
  ]
})
export class MapVizModule { }

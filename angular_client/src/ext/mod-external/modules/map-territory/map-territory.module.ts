import { NgModule } from '@angular/core';
import { MapTerritoryRoutingModule } from './map-territory-routing.module';
import {CompMapTerritoryComponent} from "../../components/comp-map-territory/comp-map-territory.component";
import {MapTerritoryService} from "../../services/map-territory.service";
import {MapTerritoryComponent} from "../map-viz/components/map-territory/map-territory.component";
import {MapBackgroundChoroService} from "../map-viz/services/map-bacground-choro/map-background-choro.service";
import {MapCentroidsService} from "../map-viz/services/map-centroids/map-centroids.service";
import {MapPopService} from "../map-viz/services/map-pop/map-pop.service";
import {SharedExternalCompModule} from "../shared-external-comp.module";
import {AllPopModule} from "../../../modules/all-pop/all-pop.module";
import {MapTitleModule} from "../../../modules/map-title/map-title.module";
import {ViewMapTerritoryComponent} from "../../views/view-map-territory/view-map-territory.component";


@NgModule({
  declarations: [
    CompMapTerritoryComponent,
    MapTerritoryComponent,
    ViewMapTerritoryComponent
    //AllPopsComponent,
    //PopMapComponent,
  ],
  imports: [
    SharedExternalCompModule,
    MapTerritoryRoutingModule,
    AllPopModule,MapTitleModule
  ],
    exports: [
        ViewMapTerritoryComponent,
        CompMapTerritoryComponent
    ],
  providers:[
    MapTerritoryService,
    MapBackgroundChoroService,
    MapCentroidsService,
    MapPopService
  ]
})
export class MapTerritoryModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AllPopsComponent} from "../../../ext/mod-external/modules/map-viz/components/all-pops/all-pops.component";
import {PopMapComponent} from "../../../ext/mod-external/modules/map-viz/components/pop-ups/pop-map/pop-map.component";
import {
  PopCirclesComponent
} from "../../../ext/mod-external/modules/map-viz/components/pop-ups/pop-circles/pop-circles.component";
import {MapPopService} from "../../../ext/mod-external/modules/map-viz/services/map-pop/map-pop.service";


@NgModule({
  declarations: [
    AllPopsComponent,
    PopMapComponent,
    PopCirclesComponent
  ],
  imports: [
    CommonModule
  ],
  providers:[
    MapPopService
  ],
  exports:[
    AllPopsComponent,
    PopMapComponent,
    PopCirclesComponent
  ]
})
export class AllPopModule { }

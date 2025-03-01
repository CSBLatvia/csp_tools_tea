import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {PopMapComponent} from "../../mod-external/modules/map-viz/components/pop-ups/pop-map/pop-map.component";
import {
  PopCirclesComponent
} from "../../mod-external/modules/map-viz/components/pop-ups/pop-circles/pop-circles.component";
import {MapPopService} from "../../mod-external/modules/map-viz/services/map-pop/map-pop.service";
import {AllPopsComponent} from "../../mod-external/modules/map-viz/components/all-pops/all-pops.component";


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

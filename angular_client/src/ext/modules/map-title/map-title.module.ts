import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MapTitleComponent} from "./components/map-title/map-title.component";

@NgModule({
  declarations: [
    MapTitleComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    MapTitleComponent
  ]
})
export class MapTitleModule { }

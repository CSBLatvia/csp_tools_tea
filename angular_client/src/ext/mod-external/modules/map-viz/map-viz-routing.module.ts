import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ViewMapVizComponent} from "../../views/view-map-viz/view-map-viz.component";

const routes: Routes = [
  {
    path: '',
    component: ViewMapVizComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapVizRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ViewMapTerritoryComponent} from "../../views/view-map-territory/view-map-territory.component";

const routes: Routes = [
  {path: '',component: ViewMapTerritoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapTerritoryRoutingModule { }

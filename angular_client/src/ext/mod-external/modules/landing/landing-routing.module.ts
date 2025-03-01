import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompLandingComponent} from "../../components/comp-landing/comp-landing.component";

const routes: Routes = [
  {path: '',component: CompLandingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }

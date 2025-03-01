import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AboutApiViewComponent} from "../view-about-api/about-api-view.component";

const routes: Routes = [
  {
    path: '',
    component: AboutApiViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutApiRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompareViewComponent} from "../view-compare/compare-view.component";

const routes: Routes = [
  {path: '',component: CompareViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompareRoutingModule { }

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IframeViewComponent} from "../view-iframe/iframe-view.component";


const routes: Routes = [
  {
    path: '',
    component: IframeViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IframeRoutingModule { }

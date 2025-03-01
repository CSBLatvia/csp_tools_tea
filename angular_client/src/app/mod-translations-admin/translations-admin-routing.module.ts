import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminViewComponent} from './components/admin-view/admin-view.component';




const routes: Routes = [
  {path: '', component: AdminViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TranslationsAdminRoutingModule { }

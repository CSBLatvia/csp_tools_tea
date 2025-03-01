import { NgModule } from '@angular/core';
import {NoPreloading, RouterModule, Routes} from '@angular/router';

const routes: Routes = [

  //  1) ext-map-territory
  {
    path: ':lang/ext-map-territory/:year/:M1/:M2/:T1/:T2/:M3/:M4',
    pathMatch: 'full',
    loadChildren: () => import('./mod-external/modules/map-territory/map-territory.module').then(m => m.MapTerritoryModule)
  },
  //  2) ext-map-viz
  {
    path: ':lang/ext-map-viz/:year/:M1/:M2/:T1/:T2/:M3/:M4',
    pathMatch: 'full',
    loadChildren: () => import('./mod-external/modules/map-viz/map-viz.module').then(m => m.MapVizModule)
  },

  //  3) ext-percentage-bar
  {
    path: ':lang/ext-percentage-bar/:year/:M1/:M2/:T1/:T2/:M3/:M4',
    pathMatch: 'full',
    loadChildren: () => import('./mod-external/modules/percentage-bar/percentage-bar.module').then(m => m.PercentageBarModule)
  },

  //  4) ext-percentage-list
  {
    path: ':lang/ext-percentage-list/:year/:M1/:M2/:T1/:T2/:M3/:M4',
    pathMatch: 'full',
    loadChildren: () => import('./mod-external/modules/percentage-list/percentage-list.module').then(m => m.PercentageListModule)
  },
  //  5) ext-pie-chart
  {
    path: ':lang/ext-pie-chart/:year/:M1/:M2/:T1/:T2/:M3/:M4/:direction',
    pathMatch: 'full',
    loadChildren: () => import('./mod-external/modules/pie-chart/pie-chart.module').then(m => m.PieChartModule)
  },
  //  6) ext-lines-chart
  {
    path: ':lang/ext-lines-chart/:year/:M1/:M2/:T1/:T2/:M3/:M4',
    pathMatch: 'full',
    loadChildren: () => import('./mod-external/modules/lines-chart/lines-chart.module').then(m => m.LinesChartModule)
  },
  //  7) ext-flow-chart
  {
    path: ':lang/ext-flow-chart/:year/:M1/:M2/:T1/:T2/:M3/:M4',
    pathMatch: 'full',
    loadChildren: () => import('./mod-external/modules/flow-chart/flow-chart.module').then(m => m.FlowChartModule)
  },
  //  8) ext-scatter-plot
  {
    path: ':lang/ext-scatter-plot/:year/:M1/:M2/:T1/:T2/:M3/:M4/:SX/:SY/:axisType',
    pathMatch: 'full',
    loadChildren: () => import('./mod-external/modules/scatter-plot/scatter-plot.module').then(m => m.ScatterPlotModule)
  },
  ///////////////////////////////////////

  // none existing route
  {path: '**', redirectTo: ''},

  //  1) ext-map-territory
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./mod-external/modules/landing/landing.module').then(m => m.LandingModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      enableTracing: false,
      preloadingStrategy: NoPreloading
    }
  )],
  exports: [RouterModule]
})
export class ExtRoutingModule { }

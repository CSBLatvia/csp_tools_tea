import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules, NoPreloading} from '@angular/router';


const routes: Routes = [
  // landing
  { path: '',
    redirectTo: 'lv/landing/latest/workplace/number-of-workplaces/territories-3/all/none/none',
    pathMatch:'full'
  },
  { path: 'lv',
    redirectTo: 'lv/landing/latest/workplace/number-of-workplaces/territories-3/all/none/none',
    pathMatch:'full'
  },
  { path: 'en',
    redirectTo: 'en/landing/latest/workplace/number-of-workplaces/territories-3/all/none/none',
    pathMatch:'full'
  },

  // landing
  // https://tools.csb.gov.lv/tea_3/lv/landing/2020/workplace/none/territories-3/all/none/none
  {
    path: ':lang/landing/:year/:M1/:M2/:T1/:T2/:M3/:M4',
    pathMatch: 'full',
    loadChildren: () => import('./mod-landing/landing.module').then(m => m.LandingModule)
  },

  // territory
  {
    path: ':lang/territory/:year/:M1/:M2/:T1/:T2/:M3/:M4',
    pathMatch: 'full',
    loadChildren: () => import('./mod-territory/territory.module').then(m => m.TerritoryModule)
  },
  // compare
  {
    path: ':lang/compare/:year/:M1/:M2/:T1/:T2/:M3/:M4/:SX/:SY',
    pathMatch: 'full',
    loadChildren: () => import('./mod-compare/compare.module').then(m => m.CompareModule)
  },

  // map
  {
    path: ':lang/map/:year/:M1/:M2/:T1/:T2/:M3/:M4',
    pathMatch: 'full',
    loadChildren: () => import('./mod-map/map.module').then(m => m.MapModule)
  },

  // about
  { path: ':lang/about', pathMatch: 'full', loadChildren: () => import('./mod-about/about.module').then(m => m.AboutModule)},

  // api
  { path: ':lang/api', pathMatch: 'full', loadChildren: () => import('./mod-about-api/about-api.module').then(m => m.AboutApiModule)},

  // api
  { path: ':lang/iframe', pathMatch: 'full', loadChildren: () => import('./mod-iframe/iframe.module').then(m => m.IframeModule)},

  // text_editor
  {
    path: 'text_editor',
    pathMatch: 'full',
    loadChildren: () => import('./mod-translations-admin/translations-admin.module').then(m => m.TranslationsAdminModule)
  },

  // none existing route
  {path: '**', redirectTo: 'lv/landing/2020/workplace/number-of-employees/territories-3/all/none/none'}

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
export class AppRoutingModule { }

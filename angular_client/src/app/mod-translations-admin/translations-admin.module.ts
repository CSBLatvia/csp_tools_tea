import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslationsAdminRoutingModule } from './translations-admin-routing.module';

import {LoginService} from './services/login.service';

import {FormsModule} from '@angular/forms';
import {AdminViewComponent} from './components/admin-view/admin-view.component';
import {AdminLoginComponent} from './components/admin-login/admin-login.component';
import { ItemCreateComponent } from './views/view-translations/components/item-create/item-create.component';
import { ItemModifyComponent } from './views/view-translations/components/item-modify/item-modify.component';
import { ViewTranslationsComponent } from './views/view-translations/view-translations.component';
import { ViewTextsPopComponent } from './views/view-texts-pop/view-texts-pop.component';
import { ViewTextsTitleComponent } from './views/view-texts-title/view-texts-title.component';
import {ItemListComponent} from './views/view-translations/components/item-list/item-list.component';

import { TableListComponent } from './components/table-list/table-list.component';
import {TableFilterComponent} from './views/view-translations/components/table-filter/table-filter.component';
import {TopMenuComponent} from './components/top-menu/top-menu.component';
import {TableServiceTranslations} from './views/view-translations/services/table.service';
import {TableServiceTextsTitle} from './views/view-texts-title/services/table.service';
import {TableServiceTextsPop} from './views/view-texts-pop/services/table.service';
import {ItemListTextPopComponent} from './views/view-texts-pop/components/item-list/item-list.component';
import {ItemModifyTextsPopComponent} from './views/view-texts-pop/components/item-modify/item-modify.component';
import {ItemListTextTitleComponent} from './views/view-texts-title/components/item-list/item-list.component';
import {ItemModifyTextsTitleComponent} from './views/view-texts-title/components/item-modify/item-modify.component';
import {ClaritySharedModule} from "../mod-clarity-shared/clarity-shared.module";


@NgModule({
  declarations: [
    AdminViewComponent,
    AdminLoginComponent,
    ItemListComponent,ItemListTextPopComponent,ItemListTextTitleComponent,
    TopMenuComponent,
    TableFilterComponent,
    ItemCreateComponent,
    ItemModifyComponent,ItemModifyTextsPopComponent,ItemModifyTextsTitleComponent,
    ViewTranslationsComponent,
    ViewTextsPopComponent,
    ViewTextsTitleComponent,
    TableListComponent
  ],
  imports: [
    CommonModule,
    TranslationsAdminRoutingModule,
    FormsModule,
    ClaritySharedModule
  ],
  exports:[AdminViewComponent],
  providers: [LoginService,TableServiceTranslations,TableServiceTextsTitle,TableServiceTextsPop]
})
export class TranslationsAdminModule { }

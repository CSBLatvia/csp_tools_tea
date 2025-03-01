import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {UiControlLargeToggleComponent} from '../ui-control-large-toggle/ui-control-large-toggle.component';
import {UiControlComboBoxComponent} from '../ui-control-combo-box/ui-control-combo-box.component';
import {UiControlDropdownComponent} from '../ui-control-dropdown/ui-control-dropdown.component';
import {UiControlRadioComponent} from '../ui-control-radio/ui-control-radio.component';
import {UiControlRadioItemComponent} from '../ui-control-radio/items/item-radio/ui-control-radio-item.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgScrollbarModule } from 'ngx-scrollbar';
import {UiControlTagsListComponent} from "../ui-control-tags-list/ui-control-tags-list.component";



@NgModule({
  declarations: [
    UiControlLargeToggleComponent,
    UiControlComboBoxComponent,
    UiControlDropdownComponent,
    UiControlRadioComponent,
    UiControlRadioItemComponent,
    UiControlTagsListComponent
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    NgScrollbarModule,
    FormsModule
  ],
  exports: [
    UiControlLargeToggleComponent,
    UiControlComboBoxComponent,
    UiControlDropdownComponent,
    UiControlRadioComponent,
    UiControlRadioItemComponent,
    UiControlTagsListComponent
  ]
})
export class UiControlsModule { }

import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ControlValueVO} from '../../../vos/ControlValueVO';

@Component({
  selector: 'app-item-radio',
  templateUrl: './ui-control-radio-item.component.html',
  styleUrls: ['./ui-control-radio-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class UiControlRadioItemComponent implements OnInit {

  @Input() value:ControlValueVO;
  @Input() lang:string;

  constructor() { }
  ngOnInit() {}

}

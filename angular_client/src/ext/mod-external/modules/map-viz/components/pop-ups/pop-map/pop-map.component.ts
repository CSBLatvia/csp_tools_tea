import {Component, Input, OnInit} from '@angular/core';
import {IPop} from '../IPop';
import {PopSimpleVO} from '../vos/PopSimpleVO';

@Component({
  selector: 'pop-map',
  templateUrl: './pop-map.component.html',
  styleUrls: ['./pop-map.component.scss']
})
export class PopMapComponent implements OnInit,IPop {

  public vo:PopSimpleVO;
  @Input() x:number=0;
  @Input() y:number=0;
  @Input() visible:boolean=false;

  public gapX:number = 18;
  public gapY:number = - 5;

  constructor() { }
  ngOnInit() {}

}

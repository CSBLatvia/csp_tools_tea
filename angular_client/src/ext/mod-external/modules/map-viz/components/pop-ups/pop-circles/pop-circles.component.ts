import {Component, Input, OnInit} from '@angular/core';
import {IPop} from '../IPop';
import {PopVO} from '../vos/PopVO';

@Component({
  selector: 'pop-circles',
  templateUrl: './pop-circles.component.html',
  styleUrls: ['./pop-circles.component.scss']
})
export class PopCirclesComponent implements OnInit,IPop {

  public vo:PopVO;
  @Input() theme:number;
  @Input() x:number=0;
  @Input() y:number=0;
  @Input() visible:boolean=false;

  public gapX:number = 18;
  public gapY:number = - 5;

  constructor() { }
  ngOnInit() {}

}

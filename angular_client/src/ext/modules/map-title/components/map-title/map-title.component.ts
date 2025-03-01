import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TranslationVO} from "../../../../../app/model/vo/TranslationVO";


@Component({
  selector: 'map-title',
  templateUrl: './map-title.component.html',
  styleUrls: ['./map-title.component.scss']
})
export class MapTitleComponent implements OnInit {

  @Input() mobile:boolean = false;
  @Input() lang:string;
  @Input() vo:TranslationVO;


  constructor() { }

  ngOnInit() {
      this.initialize();
  }

  initialize():void {

  }

}

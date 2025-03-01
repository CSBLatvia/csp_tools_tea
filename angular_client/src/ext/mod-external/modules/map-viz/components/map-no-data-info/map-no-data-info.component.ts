import {Component, OnInit} from '@angular/core';
import {MapVizService} from "../../../../services/map-viz.service";
import {TranslationVO} from "../../../../../../app/model/vo/TranslationVO";


@Component({
  selector: 'map-no-data-info',
  templateUrl: './map-no-data-info.component.html',
  styleUrls: ['./map-no-data-info.component.scss']
})
export class MapNoDataInfoComponent implements OnInit {

  public titleVO:TranslationVO;

  constructor(private service:MapVizService) { }

  ngOnInit(): void {
    this.titleVO = this.service.model.translations.item('map-no-data-info');
    this.titleVO.lang = this.service.model.route.lang;
  }

}

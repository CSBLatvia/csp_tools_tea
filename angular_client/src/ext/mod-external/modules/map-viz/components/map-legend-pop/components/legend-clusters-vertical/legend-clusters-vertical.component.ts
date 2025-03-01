import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {MapVizService} from "../../../../../../services/map-viz.service";
import {ClusterVO} from "../../../../../../../model/vo/ClusterVO";
import {TitlesVO} from "../../../../../../../model/vo/TitlesVO";
import {TranslationVO} from "../../../../../../../../app/model/vo/TranslationVO";



@Component({
  selector: 'app-legend-clusters-vertical',
  templateUrl: './legend-clusters-vertical.component.html',
  styleUrls: ['./legend-clusters-vertical.component.scss']
})
export class LegendClustersVerticalComponent implements OnInit,OnDestroy,OnChanges {

  @Input() clusters:Array<ClusterVO> = [];
  @Input() impossibleData:boolean = false;
  @Input() dataIsNotComplete:boolean = false;
  @Input() zerroData:boolean = false;
  @Input() lang:string;
  @Input() titlesVO:TitlesVO;

  public titleImpossibleVO:TranslationVO;
  public impossibleColor:string;

  private onModelReadyListener:any;
  public initialized:boolean = false;
  public noDataTitle:TranslationVO;


  constructor(private service:MapVizService) {}
  ngOnDestroy(): void {
    this.onModelReadyListener.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['lang']){
      this.updateLocalizations();
    }
    if(changes['clusters']){
      this.dataIsNotComplete = this.service.dataIsNotComplete;
      // console.log('LegendClustersVerticalComponent - onChanges');
      // console.dir(this.clusters);
    }
  }
  ngOnInit() {
    this.onModelReadyListener = this.service.model.onModelReady.subscribe(this.onModelReady);
    if(this.service.model.READY===true && this.initialized===false){
      this.initialize();
    }
  }
  private onModelReady=():void=>{
    if(this.initialized===true){return;}
    this.initialize();
  }
  initialize():void{
    if(this.initialized===true){return;}
    this.initialized = true;
    this.impossibleColor = this.service.model.config.mapColors.map_no_value_color;
    this.updateLocalizations();
  }
  private updateLocalizations():void{
    if(this.initialized===false){return;}
    this.lang = this.service.route.lang;

    this.noDataTitle = this.service.model.translations.item('legend-no-data-info');
    this.noDataTitle.lang = this.lang;

    this.titleImpossibleVO = this.service.model.translations.item('legend-clusters-impossible');
    this.titleImpossibleVO.lang = this.lang;

  }

}

import {EventEmitter, inject, Injectable} from '@angular/core';
import {AComponentService} from "./AComponentService";
import {IComponentService} from "./IComponentService";
import {HttpClient} from "@angular/common/http";
import {MapPopService} from "../modules/map-viz/services/map-pop/map-pop.service";
import {TitlesService} from "../modules/map-viz/services/titles/titles.service";

import {throwError} from "rxjs";
import { v4 as uuidv4 } from 'uuid';
import { RouteVO } from 'src/app/model/vo/RouteVO';
import { ControlValueVO } from 'src/app/ui-controls/vos/ControlValueVO';
import {RegionNameVO} from "../../model/vo/RegionNameVO";
import {TranslationVO} from "../../../app/model/vo/TranslationVO";
import {IModel} from "../../../app/model/IModel";

export class MapTerritoryService  extends AComponentService implements IComponentService{

  public onServiceReady:EventEmitter<string> = new EventEmitter<string>();

  // map_light
  // map_osm
  // map_rupucs

  public id:string;

  public MAP_POP_STYLE:string = 'map_rupucs';

  public dataIsNotComplete:boolean = false;
  public MAP_SIZE:number;
  public MAP_ZOOM:number;

  public override route:RouteVO;
  /////////////////////
  public override model:IModel;
  public popService:MapPopService = inject(MapPopService);
  public titlesService:TitlesService = inject(TitlesService);
  protected override http:HttpClient = inject(HttpClient);

  ///////////////////////////////////////
  // all props for map and viz
  ///////////////////////////////////////
  public regionNames:Array<RegionNameVO> = [];
  public regionNames_ids:Array<string> = [];
  ///////////////////////////////////////
  private readyCount:number=0;
  private READY:boolean = false;
  private initialized:boolean = false;
  //////////////////////////////////////

  constructor() {
    super();
    this.id = uuidv4();
  }
  public initialize(route:RouteVO):void{
    if(this.initialized==true){return;}

    this.route = route;
    this.initialized = true;
    this.popService.initialize(this);
    this.titlesService.initialize(this);
    this.loadTerritories();
  }
  public update(route:RouteVO):void{
    this.initialized=false;
    this.READY = false;
    this.readyCount=0;
    this.route = route;
    this.initialized = true;
    this.popService.initialize(this);
    this.titlesService.initialize(this);
    this.loadTerritories();
  }

  private loadTerritories():void{
    const id:string = this.route.T1;
    this.http.get(this.model.config.serviceURL+'?db=menu-territories&level='+id+'&year='+this.route.year).subscribe((data:any) => this.onLoadTerritoriesDone({...data}));
  }
  private onLoadTerritoriesDone=(data:any):void=>{
    const t2_data:Array<ControlValueVO> = [];
    t2_data.push(new ControlValueVO('all',this.model.translations.item('territories-all')));

    if(data.info==='ok'){

      let arr:Array<any> = data.data as Array<any>;
      ///////////////////////////////////////////////
      const collator:any = new Intl.Collator('lv');
      arr = arr.sort(function(a:any, b:any) {
        return collator.compare(a.name_lv.toLowerCase(), b.name_lv.toLowerCase());
      });

      ///////////////////////////////////////////////
      let i:number=0;
      const L:number=arr.length;
      let item:any;

      const regionNames:Array<RegionNameVO> = [];
      const regionNames_ids:Array<string> = [];

      while(i<L){
        item = arr[i];
        t2_data.push(
          new ControlValueVO(
            item.code,
            new TranslationVO(item.code,item.name_lv,item.name_en)
          )
        );
        //////////////////////////////
        // model
        regionNames.push(
          new RegionNameVO(
            item.code,
            new TranslationVO(item.code,item.name_lv,item.name_en),
            new TranslationVO(item.code,item.name_lv_short,item.name_en_short)
          )
        );
        regionNames_ids.push(item.code);
        /////////////////////////////
        i++;
      }

      this.regionNames = [...regionNames];
      this.regionNames_ids = [...regionNames_ids];

      this.readyCount++;
      this.checkReady();

    }else{
      throwError('MAP-TERRITORY-SERVICE - onLoadTerritoriesDone - ERROR');
    }

  }   //readyCount  - 1
  ////////////////////////////////////////

  private checkReady(){
    if(this.readyCount==1){
      this.READY=true;
      this.onServiceReady.emit('update');
    }else{ return;}
  }

  //////////////////////////////////////////
  public getRegionbyCode(code:string):RegionNameVO{
    const arr:Array<string> = code.split('parent-');
    if(arr.length>1){
      code = arr[1];
    }
    if(code==='LV'|| code==='all'){
      return new RegionNameVO(code, new TranslationVO(code,'Visa Latvija','All country'),new TranslationVO(code,'Visa Latvija','All country'));
    }
    const index:number = this.regionNames_ids.indexOf(code);
    if(index!==-1){
      return this.regionNames[index];
    }else{
      // console.error('getRegionbyCode('+code+') - region not found !!!');
      return null;
    }
  }
}

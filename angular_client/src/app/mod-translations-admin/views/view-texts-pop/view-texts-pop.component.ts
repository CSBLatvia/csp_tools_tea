import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TableServiceTextsPop} from './services/table.service';

import {TextsPopVO} from '../../vos/TextsPopVO';
import {TranslationVO} from "../../../model/vo/TranslationVO";

@Component({
  selector: 'app-view-texts-pop',
  templateUrl: './view-texts-pop.component.html',
  styleUrls: ['./view-texts-pop.component.scss']
})
export class ViewTextsPopComponent implements OnInit,OnDestroy {


  public initialized:boolean = false;
  public onModelReadyListener:any;
  public onRouteUpdateListener:any;

  public onItemsListUpdateListener:any;
  public onItemModifyListener:any;
  public onItemModifyErrorListener:any;

  public popModifyTitleVO:TranslationVO;
  public popModifyDescriptionVO:TranslationVO;

  public cancelVO:TranslationVO = new TranslationVO('cancel','atcelt','cancel') ;
  public submitVO:TranslationVO = new TranslationVO('submit','apstiprināt','submit') ;
  public saveVO:TranslationVO = new TranslationVO('save','saglabāt','save') ;
  public okVO:TranslationVO = new TranslationVO('ok','OK','OK') ;

  public createViewTitleVO:TranslationVO;
  public inputEmptyVO:TranslationVO;



  public items:Array<TextsPopVO>=[];

  public modifySuccessPop:boolean = false;
  public modifyErrorPop:boolean = false;

  public modifyVO:TextsPopVO;
  public actionModify:boolean = false;
  public posY:number=0;


  constructor(public service:TableServiceTextsPop) { }

  ngOnInit(): void {
    this.cancelVO.lang='en';
    this.submitVO.lang='en';
    this.saveVO.lang='en';
    this.okVO.lang='en';
    this.onItemsListUpdateListener = this.service.onItemsListUpdate.subscribe(this.onItemsUpdate);
    this.onItemModifyListener = this.service.onItemModify.subscribe(this.onModifySuccess);
    this.onItemModifyErrorListener = this.service.onItemModifyError.subscribe(this.onModifyError);

    this.initialize();
  }
  ngOnDestroy(): void {
    this.onItemsListUpdateListener.unsubscribe();
    this.onItemModifyListener.unsubscribe();
    this.onItemModifyErrorListener.unsubscribe();
  }
  initialize():void{
    if(this.initialized===true){return;}
    this.initialized = true;
    this.service.loadItems();
  }

  private onItemsUpdate=():void=>{
    this.items = this.service.items;
  }
  public onModify=(obj:any):void=>{
    this.actionModify = true;
    this.posY = obj.y;
    this.modifyVO = obj.vo;
  }
  public onModifyCancel=(vo:TextsPopVO):void=>{
    this.actionModify = false;
  }
  public onModifySubmit=(vo:TextsPopVO):void=>{
    this.service.modify(vo);
    this.actionModify = false;
  }

  private onModifySuccess=():void=>{
    this.modifySuccessPop = true;
  }
  public onModifyError=(error:string):void=>{
    this.modifyErrorPop = true;
  }
  public closePops():void{
    this.modifySuccessPop = false;
    this.modifyErrorPop = false;
  }

}

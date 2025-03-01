import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TableServiceTranslations} from './services/table.service';
import {LoginService} from '../../services/login.service';
import { TranslationVO } from 'src/app/model/vo/TranslationVO';

@Component({
  selector: 'app-view-translations',
  templateUrl: './view-translations.component.html',
  styleUrls: ['./view-translations.component.scss']
})
export class ViewTranslationsComponent implements OnInit,OnDestroy {

  @Input() user:string = '';

  public initialized:boolean = false;
  public onModelReadyListener:any;
  public onRouteUpdateListener:any;

  public onItemsListUpdateListener:any;
  public onItemModifyListener:any;
  public onItemCreateListener:any;
  public onItemDeleteListener:any;

  public onItemModifyErrorListener:any;
  public onItemCreateErrorListener:any;
  public onItemDeleteErrorListener:any;

  public popModifyTitleVO:TranslationVO;
  public popModifyDescriptionVO:TranslationVO;

  public cancelVO:TranslationVO = new TranslationVO('cancel','atcelt','cancel') ;
  public submitVO:TranslationVO = new TranslationVO('submit','apstiprināt','submit') ;
  public okVO:TranslationVO = new TranslationVO('ok','OK','OK') ;
  public saveVO:TranslationVO = new TranslationVO('save','saglabāt','save') ;

  public createViewTitleVO:TranslationVO;
  public inputEmptyVO:TranslationVO;



  public items:Array<TranslationVO>=[];


  public createSuccessPop:boolean = false;
  public createErrorPop:boolean = false;

  public modifySuccessPop:boolean = false;
  public modifyErrorPop:boolean = false;

  public deleteCheckPop:boolean = false;
  public deleteSuccessPop:boolean = false;
  public deleteErrorPop:boolean = false;

  ////////////////////////////////////////////////////////////////////////

  public createVO:TranslationVO;
  public deleteVO:TranslationVO;
  public modifyVO:TranslationVO;

  public actionCreate:boolean = false;
  public actionModify:boolean = false;
  public posY:number=0;


  constructor(public service:TableServiceTranslations, public loginService:LoginService) {
  }

  ngOnInit(): void {
    this.cancelVO.lang='en';
    this.submitVO.lang='en';
    this.saveVO.lang='en';
    this.okVO.lang='en';

    this.onItemsListUpdateListener = this.service.onItemsListUpdate.subscribe(this.onItemsUpdate);
    this.onItemModifyListener = this.service.onItemModify.subscribe(this.onModifySuccess);
    this.onItemCreateListener = this.service.onItemCreate.subscribe(this.onCreateSuccess);
    this.onItemDeleteListener = this.service.onItemDelete.subscribe(this.onDeleteSuccess);

    this.onItemModifyErrorListener = this.service.onItemModifyError.subscribe(this.onModifyError);
    this.onItemCreateErrorListener = this.service.onItemCreateError.subscribe(this.onCreateError);
    this.onItemDeleteErrorListener = this.service.onItemDeleteError.subscribe(this.onDeleteError);

    this.initialize();
  }
  ngOnDestroy(): void {
    //this.logger.log('view-translations - ngOnDestroy');
    this.onItemsListUpdateListener.unsubscribe();
    this.onItemModifyListener.unsubscribe();
    this.onItemCreateListener.unsubscribe();
    this.onItemDeleteListener.unsubscribe();

    this.onItemModifyErrorListener.unsubscribe();
    this.onItemCreateErrorListener.unsubscribe();
    this.onItemDeleteErrorListener.unsubscribe();
  }
  initialize():void{
    if(this.initialized===true){return;}
    this.initialized = true;
    this.service.loadItems();
  }

  private onItemsUpdate=():void=>{
    this.items = this.service.items_filtered;
  }
  public onModify=(obj:any):void=>{
    this.actionModify = true;
    this.posY = obj.y;
    this.modifyVO = obj.vo;
  }
  public onModifyCancel=(vo:TranslationVO):void=>{
    this.actionModify = false;
  }
  public onModifySubmit=(vo:TranslationVO):void=>{
    this.service.modify(vo);
    this.actionModify = false;
  }

  private onModifySuccess=():void=>{
    this.modifySuccessPop = true;
  }
  public onModifyError=(error:string):void=>{
    this.modifyErrorPop = true;
  }

  public onCreate=():void=>{
    this.createVO = new TranslationVO('','','',false,false);
    this.actionCreate = true;
  }
  public onCreateCancel=(vo:TranslationVO):void=>{
    this.actionCreate = false;
    this.createVO = new TranslationVO('','','');
  }
  public onCreateSubmit=(vo:TranslationVO):void=>{
    this.service.create(vo);
    this.actionCreate = false;
  }
  public onCreateSuccess=():void=>{
    this.createSuccessPop = true;
  }
  public onCreateError=(error:string):void=>{
    this.createErrorPop = true;
  }



  public onDelete=(vo:TranslationVO):void=>{
    this.deleteVO = vo;
    this.deleteCheckPop = true;
  }
  public onDeleteCancel=():void=>{
    this.deleteCheckPop = false;
  }
  public onDeleteSubmit=():void=>{
    this.service.delete(this.deleteVO);
    this.deleteCheckPop = false;
  }
  public onDeleteSuccess=():void=>{
    this.deleteSuccessPop = true;
  }
  public onDeleteError=(error:string):void=>{
    this.deleteErrorPop = true;
  }

  public closePops():void{
    this.createSuccessPop = false;
    this.createErrorPop = false;
    this.modifySuccessPop = false;
    this.modifyErrorPop = false;

    this.deleteCheckPop = false;
    this.deleteSuccessPop = false;
    this.deleteErrorPop = false;
  }


}

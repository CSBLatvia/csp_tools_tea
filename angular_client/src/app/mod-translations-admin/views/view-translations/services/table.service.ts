import {EventEmitter, Injectable} from '@angular/core';
import {LoginVO} from '../../../vos/LoginVO';
import {HttpClient} from '@angular/common/http';
import {throwError} from 'rxjs';
import {TranslationVO} from "../../../../model/vo/TranslationVO";

@Injectable()
export class TableServiceTranslations {

  public onItemsListUpdate:EventEmitter<any> = new EventEmitter<any>();
  public onLoginUpdate:EventEmitter<LoginVO> = new EventEmitter<any>();


  public onItemModify:EventEmitter<string> = new EventEmitter<string>();
  public onItemModifyError:EventEmitter<string> = new EventEmitter<string>();
  public onItemCreate:EventEmitter<string> = new EventEmitter<string>();
  public onItemCreateError:EventEmitter<string> = new EventEmitter<string>();
  public onItemDelete:EventEmitter<string> = new EventEmitter<string>();
  public onItemDeleteError:EventEmitter<string> = new EventEmitter<string>();


  private initialized:boolean = false;
  private serviceURL:string='';

  public items:Array<TranslationVO>=[];
  public items_filtered:Array<TranslationVO>=[];
  public filter:number = -1;  // -1, 0, 1

  public modifyPopVisible:boolean  = false;
  public listViewVisible:boolean  = true;

  private TABLE:string = 'table-translations';



  constructor(private http: HttpClient) {
    this.serviceURL = 'https://tools.csb.gov.lv/tea/php/translations.php';
    this.initialized = true;
  }

  public loadItems():void{
    if(this.initialized===false){return;}
    this.http.post<any>(this.serviceURL,{table:this.TABLE, action:'list'}).subscribe((data:any) => {
      if(data.info==='ok'){
        this.loadItemsDone(data.data);
      }else{
        throwError('AdminService.loadItems - ERROR');
      }
    });
  }
  private loadItemsDone(data:any):void {
    this.items = [];
    data.forEach((item:any)=>{
      this.items.push(new TranslationVO(item.id,item.lv,item.en, item.used, item.html));
    });
    this.filterItems();
  }

  public create(vo:TranslationVO):void{
    if(this.initialized===false){return;}
    this.http.post<any>(this.serviceURL, {table:this.TABLE,data:vo,action:'create' }).subscribe((data:any) => {
      if(data.info==='ok'){
        this.createDone(vo.id);
      }else{
        this.createError(data.error_info);
      }
    });
  }
  private createDone(id:string):void {
    this.onItemCreate.emit(id);
    this.loadItems();
  }
  private createError(error:string):void {
    this.onItemCreateError.emit(error);
  }

  public modify(vo:TranslationVO):void{
    if(this.initialized===false){return;}
    this.http.post<any>(this.serviceURL, {table:this.TABLE, data:vo,action:'modify' }).subscribe((data:any) => {
      if(data.info==='ok'){
        this.modifyDone(vo.id);
      }else{
        this.modifyError(data.error_info);
      }
    });
  }
  private modifyDone(id:string):void {
    this.onItemModify.emit(id);
    this.loadItems();
  }
  private modifyError(error:string):void {
    this.onItemModifyError.emit(error);
  }

  public delete(vo:TranslationVO):void{
    if(this.initialized===false){return;}
    this.http.post<any>(this.serviceURL, {table:this.TABLE, data:vo,action:'delete' }).subscribe((data:any) => {
      if(data.info==='ok'){
        this.deleteDone(vo.id);
      }else{
        this.deleteError(data.error_info);
      }
    });
  }
  private deleteDone(id:string):void {
    this.onItemDelete.emit(id);
    this.loadItems();
  }
  private deleteError(error:string):void {
    this.onItemDeleteError.emit(error);
  }

  public filterItems=():void=>{
    this.items_filtered = [];
    if(this.filter===0){
      this.items.forEach((item:TranslationVO)=>{
        if(item.used===false){
          this.items_filtered.push(item);
        }
      });
    }else if(this.filter===1){
      this.items.forEach((item:TranslationVO)=>{
        if(item.used===true){
          this.items_filtered.push(item);
        }
      });
    }else{
      this.items_filtered = [...this.items];
    }
    this.onItemsListUpdate.emit();
  }

}

import {EventEmitter, Injectable} from '@angular/core';
import {LoginVO} from '../../../vos/LoginVO';
import {HttpClient} from '@angular/common/http';
import {throwError} from 'rxjs';
import {TextsPopVO} from '../../../vos/TextsPopVO';

@Injectable()
export class TableServiceTextsPop {

  public onItemsListUpdate:EventEmitter<any> = new EventEmitter<any>();
  public onLoginUpdate:EventEmitter<LoginVO> = new EventEmitter<any>();


  public onItemModify:EventEmitter<string> = new EventEmitter<string>();
  public onItemModifyError:EventEmitter<string> = new EventEmitter<string>();

  private initialized:boolean = false;
  private serviceURL:string='';

  public items:Array<TextsPopVO>=[];
  public items_ids:Array<string>=[];


  public modifyPopVisible:boolean  = false;
  public listViewVisible:boolean  = true;
  public TABLE:string = 'table-texts-pop';

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
        throwError('service.loadItems - ERROR');
      }
    });
  }
  private loadItemsDone(data:any):void {
    this.items = [];
    data.forEach((item:any)=>{
      this.items.push(new TextsPopVO(
        item.p_id,
        item.home_work,
        item.indicator_type,
        item.selected_territ,
        item.indicator_selected,
        item.breakdown_selected,
        item.request_type,
        item.text_display_lv,
        item.text_display_en,
        item.sql_string_from_join,
        item.sql_string_where
      ));
      this.items_ids.push(item.p_id);
    });
    //////////////////////////////
    this.onItemsListUpdate.emit();
  }

  public modify(vo:TextsPopVO):void{
    if(this.initialized===false){return;}
    this.http.post<any>(this.serviceURL, {table:this.TABLE, data:vo,action:'modify' }).subscribe((data:any) => {
      if(data.info==='ok'){
        this.modifyDone(vo.p_id);
      }else{
        this.modifyError(data.error_info);
      }
    });
  }
  private modifyDone(id:string):void {
    //this.logger.log('service - modifyDone:'+id);
    this.onItemModify.emit(id);
    this.loadItems();
  }
  private modifyError(error:string):void {
    //this.logger.log('service - modifyError:'+error);
    this.onItemModifyError.emit(error);
  }

}

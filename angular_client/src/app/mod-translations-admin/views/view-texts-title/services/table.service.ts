import {EventEmitter, Injectable} from '@angular/core';
import {LoginVO} from '../../../vos/LoginVO';
import {TextsPopVO} from '../../../vos/TextsPopVO';
import {HttpClient} from '@angular/common/http';
import {throwError} from 'rxjs';
import {TextsTitleVO} from '../../../vos/TextsTitleVO';
import {LoggerService} from "../../../../model/log/logger.service";

@Injectable()
export class TableServiceTextsTitle {

  public onItemsListUpdate:EventEmitter<any> = new EventEmitter<any>();
  public onLoginUpdate:EventEmitter<LoginVO> = new EventEmitter<any>();


  public onItemModify:EventEmitter<string> = new EventEmitter<string>();
  public onItemModifyError:EventEmitter<string> = new EventEmitter<string>();

  private initialized:boolean = false;
  private serviceURL:string='';

  public items:Array<TextsTitleVO>=[];
  public items_ids:Array<string>=[];


  public modifyPopVisible:boolean  = false;
  public listViewVisible:boolean  = true;
  public TABLE:string = 'table-texts-title';

  constructor(private http: HttpClient, private logger:LoggerService) {
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
      this.items.push(new TextsTitleVO(
        item.r_id,
        item.home_work,
        item.indicator_type,
        item.selected_territ,
        item.indicator_selected,
        item.breakdown_selected,
        item.meta_title_main_lv,
        item. meta_title_main_en,
        item.map_title_lv,
        item.map_title_en,
        item.table_title_lv,
        item.table_title_en,
        item.legend_clusters_title_lv,
        item.legend_clusters_title_en,
        item.legend_sizes_title_lv,
        item.legend_sizes_title_en,
        item.legend_circles_title_lv,
        item.legend_circles_title_en,
        item.table_col_1_title_lv,
        item.table_col_1_title_en,
        item.table_col_2_title_lv,
        item.table_col_2_title_en,
        item.table_col_3_title_lv,
        item.table_col_3_title_en,
        item.legend_list_title_lv,
        item.legend_list_title_en,
        item.meta_description_main_lv,
        item.meta_description_main_en
    ));
      this.items_ids.push(item.p_id);
    });
    //////////////////////////////
    this.onItemsListUpdate.emit();
  }

  public modify(vo:TextsTitleVO):void{
    if(this.initialized===false){return;}
    this.http.post<any>(this.serviceURL, {table:this.TABLE, data:vo,action:'modify' }).subscribe((data:any) => {
      if(data.info==='ok'){
        this.modifyDone(vo.r_id);
      }else{
        this.modifyError(data.error_info);
      }
    });
  }
  private modifyDone(id:string):void {
    this.logger.log('service - modifyDone:'+id);
    this.onItemModify.emit(id);
    this.loadItems();
  }
  private modifyError(error:string):void {
    this.logger.log('service - modifyError:'+error);
    this.onItemModifyError.emit(error);
  }
}

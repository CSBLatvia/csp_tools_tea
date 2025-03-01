import {Component} from '@angular/core';
import {TranslationVO} from "../../../model/vo/TranslationVO";
import {ABlock} from "../../../model/ABlock";
import {HttpClient} from "@angular/common/http";
import {TerritoryInfoVoItem} from "../../../model/vo/TerritoryInfoVoItem";
import {TerritoryInfoVO} from "../../../model/vo/TerritoryInfoVO";
import {DataTableVO} from "../../../model/vo/DataTableVO";
import {RouteVO} from "../../../model/vo/RouteVO";

@Component({
  selector: 'block-t1-t2-year',
  templateUrl: './block-t1-t2-year.component.html',
  styleUrls: ['./block-t1-t2-year.component.scss']
})
export class BlockT1T2YearComponent extends ABlock{

  public downloadButtonVO:TranslationVO;

  public titleRegionCode:TranslationVO;
  public titleRegionName:TranslationVO;
  public titleValueOne:TranslationVO;
  public titleValueTwo:TranslationVO;

  public data:Array<DataTableVO>=[];

  constructor(private http:HttpClient) { super();}

  public updateTitleVOS():void {
    this.titleVO = this.model.translations.item('block-territory-t1-t2-title');
    this.downloadButtonVO = this.model.translations.item('download-btn');

    this.titleRegionCode = this.model.translations.item('csv-column-region-code');
    this.titleRegionName = this.model.translations.item('csv-column-region-name');
    this.titleValueOne = this.model.translations.item('csv-column-one_'+this.route.M1 + '_' + this.route.M2);
    this.titleValueTwo = this.model.translations.item('csv-column-two_' + this.route.M1 + '_' + this.route.M2);
  }

  public onComponentValuesChanged():void {
    //// console.log('BLOCK-T1-T2 - onComponentValuesChanged()');
  }

  public loadData=(route:RouteVO):void=>{

    this.data = [];
    const url:string = this.model.config.serviceURL+'?db=data-table-list&m1='+route.M1+'&m2='+route.M2+'&m3='+route.M3+'&m4='+route.M4+'&t1='+route.T1+'&t2='+route.T2+'&year='+route.year;

    /*************
     T2 = none
     1) M3 == none
     2) M3 != none
     *************/

    /*************
     T2 != none
     1) M3 == none
     2) M3 != none
     *************/

    this.http.get(url).subscribe((data:any) => {
      if(data.info==='ok' && data.data.length>0){
        // this.logger.log('data-table-servise - LOADED DATA');
        //  this.logger.dir(data.data);

        // M1, M2
        // 0: {code: "LV0766300", name_lv_short: "Riebiņu n.", name_en_short: "Riebiņi m.", value: "1393", percentage: "44"}
        if(this.route.M3==='none' && this.route.M4==='none'){
          // this.logger.log('M1, M2');
          this.parseData(data.data);
        }

        // M1, M2, M3, M4 = top
        // code: "LV0010000", name_lv_short: "Rīga", name_en_short: "Rīga", property_id: "A", value: "1805", percentage: "44"}
        if(this.route.M3!=='none' && this.route.M4==='none'){
          // this.logger.log('M1, M2, M3, M4 = top');
          this.parseDataTOP(data.data);
        }

        // M1, M2, M3, M4 = selected value
        // {code: "LV0010000", name_lv_short: "Rīga", name_en_short: "Rīga", value: "1805", percentage: "1"}
        if(this.route.M3!=='none' && this.route.M4!=='none'){
          // this.logger.log('M1, M2, M3, M4 = selected value');
          this.parseData(data.data);
        }

        this.onDataLoaded();

      }else{
        console.error('DataTableService - ERROR');
      }
    });
  }
  private parseData(data:Array<any>):void{
    /*
      code: "LV0766300"
      data_ter: null
      name: "Riebiņu novads"
      property_id: "total"
      sort_code: "LV0766300"
      value: 1414
      value_calc: 44.2
     */
    this.data = [];
    let vo:DataTableVO;
    let region:TranslationVO;
    data.forEach((item:any)=>{

      if(item.code==='total'){
        region = this.model.translations.item('data-list-total');
      }else if(item.code==='out'){
        region = this.model.translations.item('data-list-out');
      }else if(item.code==='CONF'){
        region = this.model.translations.item('data-list-conf');
      }else if(item.code==='UNK'){
        region = this.model.translations.item('data-list-unk');
      }else if(item.code==='CORR'){
        region = this.model.translations.item('data-list-corr');
      }else{
        region = this.model.getRegionbyCode(item.code).name;
      }

      region.lang = this.route.lang;


      vo = new DataTableVO(
        region,
        parseFloat(item.value),
        parseFloat(item.value_calc),
        item.sort_code
      );

      this.data.push(vo);
    });
  }
  private parseDataTOP(data:Array<any>):void{
    this.data = [];
    let vo:DataTableVO;
    let subVO: DataTableVO;
    const arr:Array<DataTableVO> = [];
    let region:TranslationVO;

    data.forEach((item:any)=>{
      if(item.property_id!==null && item.property_id==='total'){
        // this.logger.dir(item);

        if(item.code==='total'){
          region = this.model.translations.item('data-list-total');
        }else if(item.code==='out'){
          region = this.model.translations.item('data-list-out');
        }else if(item.code==='CONF'){
          region = this.model.translations.item('data-list-conf');
        }else if(item.code==='UNK'){
          region = this.model.translations.item('data-list-unk');
        }else if(item.code==='CORR'){
          region = this.model.translations.item('data-list-corr');
        }else{
          region = this.model.getRegionbyCode(item.code).name;
        }
        region.lang = this.route.lang;

        vo = new DataTableVO(
          region,
          parseFloat(item.value),
          parseFloat(item.value_calc),
          item.sort_code
        );
        if(item.data_ter!==null&&item.data_ter.length>0) {
          /*
          property_id: "G18"
          value: 1343
          value_calc: 8091
          */
          item.data_ter.forEach((sub:any)=>{
            // this.logger.dir(sub);
            const propName:TranslationVO = this.model.settings.getM4ValueByCode(sub.property_id).name;
            subVO = new DataTableVO(
              propName,
              parseFloat(sub.value),
              parseFloat(sub.value_calc)
            );
            vo.data.push(subVO);
          });
        }
        ////////////////////////////////
        arr.push(vo);
      }
    });
    ////////////////////
    this.data = arr;
  }

  private onDataLoaded=():void=>{

    if(this.route.M3==='none'){
      ///////////////////////////////////////////////////
      const columns:Array<string>  = [this.titleRegionCode.name, this.titleRegionName.name, this.titleValueOne.name,this.titleValueTwo.name];
      let csv:string = columns.join('\t')+'\n';

      this.data.forEach((item:DataTableVO)=>{
        csv += [item.title.id, item.title.name, item.value, item.value_calc].join('\t')+'\n';
      });
      this.downloadCSV(this.getFileNameByRoute(), csv);
      ///////////////////////////////////////////////////
    }
    if(this.route.M3!=='none' && this.route.M4==='none'){
      ///////////////////////////////////////////////////
      const columns:Array<string>  = [this.titleRegionCode.name, this.titleRegionName.name,this.model.translations.item('csv-'+this.route.M3).name, this.titleValueOne.name,this.titleValueTwo.name];
      let csv:string = columns.join('\t')+'\n';

      this.data.forEach((item:DataTableVO)=>{
        const region:TranslationVO = item.title;
        let property:TranslationVO = this.model.translations.item('csv-total');
        csv += [item.title.id, region.name, property.name, item.value, item.value_calc].join('\t')+'\n';

        item.data.forEach((vo:DataTableVO)=>{
          property = vo.title;
          csv += [region.id, region.name, property.name ,vo.value, vo.value_calc].join('\t')+'\n';
        });
      });
      this.downloadCSV(this.getFileNameByRoute(), csv);
      ///////////////////////////////////////////////////
    }
    if(this.route.M3!=='none' && this.route.M4!=='none'){
      ///////////////////////////////////////////////////
      const columns:Array<string>  = [this.titleRegionCode.name, this.titleRegionName.name, this.titleValueOne.name, this.titleValueTwo.name];
      let csv:string = columns.join('\t')+'\n';

      this.data.forEach((item:DataTableVO)=>{
        csv += [item.title.id, item.title.name, item.value, item.value_calc].join('\t')+'\n';
      });
      this.downloadCSV(this.getFileNameByRoute(), csv);
      ///////////////////////////////////////////////////
    }
  }


  private downloadCSV=(fileName:string, fileString:string):void=> {
    const blob:any = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]),fileString],{ type: 'text/plain;charset=utf-8' });
    if ((window.navigator as any).msSaveOrOpenBlob){
      (window.navigator as any).msSaveBlob(blob, fileName);
    }else {
      const a:any = window.document.createElement('a');
      a.id = fileName;
      a.href = window.URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
  public onDownloadClick=():void=>{
    this.loadData(this.route);
  }
  private getFileNameByRoute():string{

    const assoc:string = this.model.translations.item('file-assoc').name;
    const m1_name:TranslationVO = this.model.translations.item('file-m1-'+this.route.M1);
    const m2_name:TranslationVO = this.model.translations.item('file-m2-'+this.route.M2);

    const m3_name:TranslationVO = this.model.translations.item('file-m3-'+this.route.M3);
    const m3_top_name:TranslationVO = this.model.translations.item('file-m3-top-'+this.route.M3);

    const t1_name:TranslationVO = this.model.translations.item('file-t1-'+this.route.T1);
    const t2_all:TranslationVO = this.model.translations.item('file-all-country');

    let str:string='';
    const region_t2_str:string = this.route.T2==='all'?t2_all.name:this.route.T2;

    if(this.route.M3==='none'){
      str = this.route.year+'_'+m1_name.name+'_'+m2_name.name+'_'+t1_name.name+'_'+region_t2_str;
    }else if(this.route.M3!=='none' && this.route.M4==='none'){
      str = this.route.year+'_'+m1_name.name+'_'+m2_name.name+'_'+m3_top_name.name+'_'+t1_name.name+'-'+region_t2_str;
    }else if(this.route.M3!=='none' && this.route.M4!=='none'){
      str = this.route.year+'_'+m1_name.name+'_'+m2_name.name+'_'+m3_name.name+'-'+this.route.M4+'_'+t1_name.name+'-'+region_t2_str;
    }
    return str.toLowerCase()+'.'+assoc;

  }
  ///////////////////////////
  override onChanges():void{
    if(this.initialized==false){return;}
    this.updateTitleVOS();
  }

}

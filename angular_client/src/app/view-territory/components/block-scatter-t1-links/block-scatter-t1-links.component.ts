import {Component} from '@angular/core';
import {ABlock} from "../../../model/ABlock";
import {TranslationVO} from "../../../model/vo/TranslationVO";
import {ControlValueVO} from "../../../ui-controls/vos/ControlValueVO";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'block-scatter-t1-links',
  templateUrl: './block-scatter-t1-links.component.html',
  styleUrls: ['./block-scatter-t1-links.component.scss']
})
export class BlockScatterT1LinksComponent extends ABlock{

  public tabVO_1:TranslationVO;
  public tabVO_2:TranslationVO;

  //compare
  public links_1:Array<any>=[];
  //map
  public links_2:Array<any>=[];
  public loading:boolean = true;

  constructor(private http:HttpClient) { super() }

  private updateTitleVOS():void{
        const sx_data:Array<ControlValueVO> = this.model.settings.sx_data;
        const sy_data:Array<ControlValueVO> = this.model.settings.sy_data;

    this.titleVO = this.model.translations.item('block-landing-m1-links-title-'+this.route.M1);
    // this.links_1=[];
    this.links_2=[
      {
        link:'/'+this.route.lang+'/map/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/'+this.model.M2_getRouteNameFromID('e',this.route.M1)+'/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(this.route.M3)+'/'+this.route.M4,
        name:this.model.translations.item('block-landing-m1-link-'+this.route.M1+'-e-map')
      },
      {
        link:'/'+this.route.lang+'/map/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/added-value/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(this.route.M3)+'/'+this.route.M4,
        name:this.model.translations.item('block-landing-m1-link-'+this.route.M1+'-av-map')
      },
      {
        link:'/'+this.route.lang+'/map/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/value-produced/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(this.route.M3)+'/'+this.route.M4,
        name:this.model.translations.item('block-landing-m1-link-'+this.route.M1+'-vp-map')
      }
    ];
    switch (this.route.T2){
      case 'none':
        this.tabVO_1 = this.model.translations.item('block-landing-m1-links-tab-compare-'+this.route.T1);
        this.tabVO_2 = this.model.translations.item('block-landing-m1-links-tab-map');
        break;

      default:
        this.tabVO_1 = this.model.translations.item('block-landing-m1-links-tab-compare-'+this.route.T1);
        this.tabVO_2 = this.model.translations.item('block-landing-m1-links-tab-map');
        break;
    }
  }

  ///////////////////////////
  override onChanges=():void=>{
    if(this.initialized==false){return;}
    let newInfo:boolean = this.oldRoute==undefined||this.route.isEqual(this.oldRoute)==false;
    this.oldRoute = this.route.clone();
    this.loading = (this.model.settings.scatter_loading==true || this.model.settings.sx_data.length==0);
    if(this.loading==false){
      this.updateTitleVOS();
    }
    if(newInfo==true){
      this.loadData();
    }
  }
  public loadData=():void=>{
    this.links_1 = [];
    const URL:string = this.model.config.serviceURL+'?db=menu-scatter-links&m1='+this.route.M1;
    this.http.get(URL).subscribe((data:any) => this.loadDataDone({...data},this.route.lang));
  }
  public loadDataDone=(data:any,lang:string='lv'):void=>{
    const links = [];
    if(data.info=='ok'){
      const items:any = data.data;
      items.forEach((item:any)=>{
        const ob:any =  {};
        const x_code:string = item.x_axis_code;
        const y_code:string = item.y_axis_code;
        ob.link = '/'+this.route.lang+'/compare/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/'+this.model.M2_getRouteNameFromID('e',this.route.M1)+'/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(this.route.M3)+'/'+this.route.M4+'/'+x_code+'/'+y_code;
        ob.name = new TranslationVO('',item.chart_title_lv,item.chart_title_en);
        ob.name.lang = this.route.lang;
        links.push(ob);
      });
      this.links_1 = links;
    }else{
      this.links_1 = [];
    }
    this.updateTitleVOS();
  }

}

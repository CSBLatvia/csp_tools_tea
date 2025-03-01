import {Component, Input} from '@angular/core';
import {ScatterPlotService} from "../../services/scatter-plot.service";
import * as Highcharts from 'highcharts';
import {AComponent} from "../../../model/AComponent";
import { v4 as uuidv4 } from 'uuid';
import {ControlValueVO} from "../../../ui-controls/vos/ControlValueVO";
import {TranslationVO} from "../../../../app/model/vo/TranslationVO";
import {RouteVO} from "../../../../app/model/vo/RouteVO";

@Component({
  selector: 'app-comp-scatter-plot',
  templateUrl: './comp-scatter-plot.component.html',
  styleUrls: ['./comp-scatter-plot.component.scss']
})
export class CompScatterPlotComponent extends AComponent {


  @Input() axisType:string = 'lin_lin'; //lin,log
  private axisTypeX:string = 'lin';
  private axisTypeY:string = 'lin';
  public series:Array<any>;
  private chart:any;
  public service:ScatterPlotService;
  public chart_id:string = uuidv4();

  private labelLin:TranslationVO;
  private labelLog:TranslationVO;
  private oldRoute:RouteVO = new RouteVO('','');

  constructor() {
    super();
    this.service = new ScatterPlotService();
  }
  override onInitialize() {
    this.axisTypeX = this.axisType.split('_')[0];
    this.axisTypeY = this.axisType.split('_')[1];
    this.service.model = this.model;
    this.service.onDataLoaded.subscribe(this.onDataLoaded);
    this.service.loadData(this.route);
    this.labelLin = this.model.translations.item('scatter-chart-scale-linear');
    this.labelLog = this.model.translations.item('scatter-chart-scale-logarithmic');
    this.updateTitleVOS();
  }
  override onChanges() {
    this.axisTypeX = this.axisType.split('_')[0];
    this.axisTypeY = this.axisType.split('_')[1];

    if(this.oldRoute.isEqual(this.route)==false){
      this.oldRoute = this.route.clone();
      this.service.loadData(this.route);
      this.updateTitleVOS();
    }else{
      this.drawChart();
    }
  }
  private updateTitleVOS():void{
    const lang:string = this.model.route.lang;

    this.labelLin.lang = lang;
    this.labelLog.lang = lang;

  }
  private onDataLoaded=(data:any):void=>{
    if(this.service.error==null&&this.service.empty==null){
      this.generateSeriesData();
      this.drawChart();
    }else{
      this.error = this.service.error;
      this.empty = this.service.empty;
    }
    this.informParentAboutSize();
    setTimeout(() => {
      this.informParentAboutSize();
    }, 10);
  }

  private generateSeriesData():void{
    let sum_x:number=0;
    let sum_y:number=0;

    this.series = [
     {
        marker: {
          symbol: 'circle'
        },
        data:[]
      }
    ];

    let index:number = -1;
    let codes:Array<string>=[];
    this.service.data.forEach((item:any)=>{
      if(codes.indexOf(item.code)==-1){
        if(this.model.regionNames_ids.indexOf(item.code)!==-1){
          this.series[0].data.push(
            {
              year: item.year,
              code: item.code,
              name: this.getRegion(item.code,this.route.lang),
              color:this.model.route.T2!=='none'?(this.model.route.T2==item.code?'#ee4a08':'#3376C4'):('#3376C4'),
              level: item.level,
              marker: {
                symbol: 'circle'
              },
              x:item.value_x,
              y: item.value_y
            }
          );
          sum_x+=item.value_x;
          sum_y+=item.value_y;
          codes.push(item.code);
        }

      }else{
        //this.logger.warn('DUPLICATED code:'+item.code);
      }
    });

    //this.x_type = sum_x == parseInt(sum_x+'')?'count':'money';
    //this.y_type = sum_y == parseInt(sum_y+'')?'count':'money';

  }
  private drawChart():void{
      const root = this;
    // @ts-ignore
     this.chart = Highcharts.chart(this.chart_id, {
      chart: {
        type: 'scatter',
        marginBottom: 80
      },
      title: {
        text: this.service.title.name,
        align: 'left'
      },
      xAxis: {
        title: {
          text: this.axisTypeX=='lin'?this.service.titleX.name:this.service.titleX.name+', '+this.labelLog.name,
        },
        type:this.axisTypeX=='lin'?'linear':'logarithmic',
        labels: {
          format: '{value}',
          allowOverlap:false,
          align: 'left',
          reserveSpace: true,
          formatter: function () {
            return root.formatAxisValue(this.value);
          }
        }
      },
      yAxis: {
        title: {
          text: this.axisTypeY=='lin'?this.service.titleY.name:this.service.titleY.name+', '+this.labelLog.name,
        },
        type:this.axisType=='lin'?'linear':'logarithmic',
        labels: {
          format: '{value}',
          allowOverlap:false,
          formatter: function () {
            return root.formatAxisValue(this.value);
          }
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        scatter: {
          showInLegend: false,
          marker: {
            radius: 5,/*2.5*/
            symbol: 'circle',
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)'
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          },
        },
        series: {
          //lineWidth: 1
        }
      },
      tooltip: {
        split: false,
        pointFormat: '{point.x}<br/>:{point.y}',
        useHTML: true,
        followPointer: true,
        followTouchMove: true,
        formatter: function () {
          return root.returnTooltipLabel(this);
        },
        valueDecimals: 2
      },
      series: this.series,
      credits: {
         enabled: false
       }
    });
  }
  public getRegion(code:string,lang:string='lv'):string{
    return lang=='lv'?this.model.getRegionbyCode(code).name.name_lv:this.model.getRegionbyCode(code).name.name_en;
  }
  private parseAsMoney(str:string){
    //const suffix: string = this.route.lang === 'lv' ? ' eiro' : ' euro';
    //////////////////////////////////////////////////
    const milj:string = this.route.lang === 'lv' ? ' mljrd.' : ' b';
    const mil:string = this.route.lang === 'lv' ? ' milj.' : ' m';
    let val:any = parseFloat(str).toFixed(2);
    let val_str:any;
    if(val>=1000000000){
      // miljardi
      val_str = Highcharts.numberFormat(val/1000000000, 2, '.',' ')+milj;
    }else if(val>=1000000){
      // miljoni
      val_str = Highcharts.numberFormat(val/1000000, 2, '.',' ')+mil;
    }else{
      // tūkstoši
      val_str = Highcharts.numberFormat(val, 0, '.',' ');
    }
    //return val_str+' '+suffix;
    return val_str;
  }
  private returnTooltipLabel=(item:any):string=>{
    let val_x:string;
    let val_y:string;
    if(this.service.x_type=='money'){
      val_x = this.parseAsMoney(item.x);
    }else{
      val_x = item.x;
    }
    if(this.service.y_type=='money'){
      val_y = this.parseAsMoney(item.y);
    }else{
      val_y = item.y;
    }

      return '<b>'+item.point.options.name+'</b><br/>' +
          this.service.titleX.name+':<b> '+val_x+'</b><br/>' +
          this.service.titleY.name+':<b> '+val_y+'</b>';
  }
  private formatAxisValue(value:any):string{
        let str = '';
        //////////////////////////////////////////////////
        const milj:string = this.route.lang === 'lv' ? ' mljrd.' : ' b';
        const mil:string = this.route.lang === 'lv' ? ' milj.' : ' m';
        let val:any = parseFloat(value+'').toFixed(2);

        if(val>=1000000000){
          // miljardi
          str = Highcharts.numberFormat(val/1000000000, 0, '.',' ')+milj;
        }else if(val>=1000000){
          // miljoni
          str = Highcharts.numberFormat(val/1000000, 0, '.',' ')+mil;
        }else if(val>=1){
          // lielāks par 1
          str = Highcharts.numberFormat(val, 0, '.',' ');
        }else{
          // mazāks par 1
          str = Highcharts.numberFormat(val, 2, '.',' ');
        }
        return str;
  }
}

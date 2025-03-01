import {Component, ViewEncapsulation} from '@angular/core';
import {LinesChartService} from "../../services/lines-chart.service";
import * as Highcharts from 'highcharts';
import {AComponent} from "../../../model/AComponent";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-comp-lines-chart',
  templateUrl: './comp-lines-chart.component.html',
  styleUrls: ['./comp-lines-chart.component.scss']
})

export class CompLinesChartComponent extends AComponent {

  private chart:any;
  public service:LinesChartService;
  public chart_id:string = uuidv4();

  constructor() {
    super();
    this.service = new LinesChartService();
    this.logger.enabled = false;
  }

  override onInitialize() {
    this.service.model = this.model;
    this.service.onDataLoaded.subscribe(this.onDataLoaded);
    this.service.loadData(this.route);
  }
  override onChanges() {
    this.service.loadData(this.route);
  }

  private onDataLoaded=(data:any):void=>{
    this.drawChart(0);
    this.informParentAboutSize();
    setTimeout(() => {
      this.informParentAboutSize();
    }, 10);
  }
  public onTabClick(id:number):void{
    this.service.setID(id);
    this.drawChart(id);
    this.informParentAboutSize();
    setTimeout(() => {
      this.informParentAboutSize();
    }, 10);
  }
  private drawChart(id:number){
    const root = this;
    Highcharts.setOptions({
      lang: {
        thousandsSep: ''
      }
    });
    // @ts-ignore
    this.chart = Highcharts.chart(this.chart_id, {
      chart: {
        type: 'line'
      },
      title: {
        text: null
      },
      xAxis: {
        categories: this.service.content[id].data.categories
      },
      yAxis: {
        title: null
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          showInLegend: this.service.content[id].data.series.length>1?true:false,
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
      series: this.service.content[id].data.series,
      credits: {
        enabled: false
      },
      legend: {
        symbolHeight: 12,
        symbolWidth: 12,
        symbolRadius: 6
      }
    });
  }

  private returnTooltipLabel=(item:any):string=>{
    let val_x:string;
    let val_y:string;
      val_x = item.x;
      val_y = item.y;
      let x_title:string = this.service.title_x;
      let y_title:string = this.service.content[this.service.id].tab.name;
let str:string = '';

  /*if(this.model.route.lang =='lv'){
    str = '<b>'+item.series.name+'</b><br/>Gads: <b>'+val_x+'</b><br/>'+y_title+':<b> '+val_y+'</b>';
  }else{
    str = '<b>'+item.series.name+'</b><br/>year: <b>'+val_x+'</b><br/>'+y_title+':<b> '+val_y+'</b>';
  }*/

    if(this.model.route.lang =='lv'){
      str = 'Gads: <b>'+val_x+'</b><br/>'+y_title+':<b> '+val_y+'</b>';
    }else{
      str = 'Year: <b>'+val_x+'</b><br/>'+y_title+':<b> '+val_y+'</b>';
    }

    return str;

  }
}

import {Component, HostListener, ViewEncapsulation} from '@angular/core';
import {FlowChartService} from "../../services/flow-chart.service";
import * as Highcharts from "highcharts";
import {scaleLinear} from 'd3-scale';
import {AComponent} from "../../../model/AComponent";
import { v4 as uuidv4 } from 'uuid';
require('highcharts/modules/sankey')(Highcharts);

@Component({
  selector: 'app-comp-flow-chart',
  templateUrl: './comp-flow-chart.component.html',
  styleUrls: ['./comp-flow-chart.component.scss']
})
export class CompFlowChartComponent extends AComponent {

  public nodes:Array<any>=[];
  public data:Array<any>=[];
  public ids:Array<string> = [];
  public direction:number = 1;
  public service:FlowChartService;
  public chart_id:string = uuidv4();
  private mobile:boolean = false;
  private MOBILE_SIZE:number = 600

  constructor() {
    super();
    this.service = new FlowChartService();

    if(this.compRef!==undefined){
      this.mobile = this.compRef.element.nativeElement.offsetWidth<this.MOBILE_SIZE?true:false;
    }

  }

  override onInitialize() {
    this.service.model = this.model;
    this.service.onDataLoaded.subscribe(this.onDataLoaded);
    this.service.loadData(this.route);
    this.resize();
  }
  override onChanges() {
    this.service.loadData(this.route);
  }


  private onDataLoaded=(data:any):void=>{
    this.logger.log('**************');
    this.logger.log('CompFlowChartComponent - onDataLoaded()');
    this.logger.dir(this.service.data);
    this.logger.log('**************');

    if(this.service.error==null&&this.service.empty==null){
      if(this.mobile==false){
        this.parseData('horizontal');
        this.drawChart('horizontal');
      }else{
        this.parseData('vertical');
        this.drawChart('vertical');
      }

    }else{
      this.error = this.service.error;
      this.empty = this.service.empty;
    }
    this.informParentAboutSize();
    setTimeout(() => {
      this.informParentAboutSize();
    }, 10);
  }
  private drawChart(type:string = 'horizontal'):void{
    if(type == 'horizontal'){
        this.drawHorizontal();
    }else{
      this.drawVertical();
    }
    this.informParentAboutSize();
    setTimeout(() => {
      this.informParentAboutSize();
    }, 10);
  }
  private drawHorizontal():void{
    const root = this;
    // @ts-ignore
    Highcharts.chart(this.chart_id, {
      chart: {
        type: 'sankey',
        inverted: false
      },
      title: false,
      accessibility: {
        point: { valueDescriptionFormat: '{index}. {point.from} to {point.to}, ' +'{point.weight}.' }
      },
      plotOptions: {
        sankey: {
          states: {
            inactive: {
              enabled: false
            }
          },
          tooltip: {
            headerFormat: null,
            nodeFormat: '{point.name}: <b>{point.sum}</b><br/>',
            pointFormat:'{point.fromNode.name} -> {point.toNode.name}:<b> {point.value}</b> ',
          }
        }
      },
      series: [{
        type: 'sankey',
        nodeAlignment: 'center',
        linkColorMode: 'gradient',
        nodeWidth: '100',
        linkOpacity:0.8,
        keys: ['from', 'to', 'weight', 'value'],
        nodes:root.nodes,
        data:root.data
      }],
      credits: {
        enabled: false
      }

    });

  }
  private drawVertical():void{
    const root = this;
    // @ts-ignore
    Highcharts.chart(this.chart_id, {
      chart: {
        type: 'sankey'
      },
      title: false,
      accessibility: {
        point: { valueDescriptionFormat: '{index}. {point.from} to {point.to}, ' +'{point.weight}.' }
      },
      plotOptions: {
        sankey: {
          states: {
            inactive: {
              enabled: false
            }
          },
          tooltip: {
            headerFormat: null,
            nodeFormat: '{point.name}: <b>{point.sum}</b><br/>',
            pointFormat:'{point.fromNode.name} -> {point.toNode.name}:<b> {point.value}</b> ',
          }
        }
      },
      series: [{
        type: 'sankey',
        nodeAlignment: 'top',
        linkColorMode: 'gradient',
        nodeWidth: '100',
        linkOpacity:0.8,
        keys: ['from', 'to', 'weight', 'value'],
        nodes:root.nodes,
        data:root.data
      }],
      credits: {
        enabled: false
      }

    });

  }
  public returnToolTipNode(ob){
    this.logger.dir(ob);
    return '';
  }

  private parseData(type:string = 'horizontal'):void{
    if(type == 'horizontal'){
      this.parseDataHorizontal();
    }else{
      this.parseDatavertical();
    }
  }
  private parseDataHorizontal(){
    this.logger.log('**************');
    this.logger.log('FLOW-CHART - parseData');
    this.logger.log('**************');
    this.logger.dir(this.service.data);
    this.logger.log('**************');
    const data_w = this.service.data.w.data;
    const data_h = this.service.data.h.data;
    this.logger.log('W:');
    this.logger.dir(data_w);
    this.logger.log('H:');
    this.logger.dir(data_h);
    this.logger.log('**************');
    this.nodes = [];
    this.ids = [];
    this.data = [];

    const col_primary = '#3376C4';
    const col_secondary = '#8c8c8c';
    const col_zero = '#bdbdbd';
    const colorScale = scaleLinear<string>().domain([0, 100]).range([col_zero, col_secondary]);

    this.direction = data_h.length==1?1:-1;

    //home
    for(let i:number=0;i<data_h.length;i++){
      const ob = data_h[i];
      //{name: 'Jēkabpils novads', value: 440, pct: 22.5}
      const L:number = this.nodes.push({id:ob.name, color:data_h.length>1?colorScale(ob.pct):col_primary,dataLabels: {
          align: 'left',
          enabled: true
        }});
      this.ids[L-1] = ob.name;
    }
    //work
    for(let i:number=0;i<data_w.length;i++){
      const ob = data_w[i];
      //{name: 'Jēkabpils novads', value: 440, pct: 22.5}
      const L:number = this.nodes.push({id:ob.name,color:data_w.length>1?colorScale(ob.pct):col_primary, dataLabels: {
          align: 'right',
          enabled: true
        }});
      this.ids[L-1] = ob.name;
    }
    // {name: 'Balvu novads', value: 19, pct: 1}
    if(data_w.length>1){
      for(let i:number=0;i<data_w.length;i++){
        const ob = data_w[i];
        this.data.push([data_h[0].name, ob.name, ob.value, ob.value]);
      }
    }else{
      for(let i:number=0;i<data_h.length;i++){
        const ob = data_h[i];
        this.data.push([ob.name, data_w[0].name, ob.value, ob.value]);
      }
    }

    /*
    this.logger.log('**************');
    this.logger.log('nodes:');
    this.logger.dir(this.nodes);
    this.logger.log('data:');
    this.logger.dir(this.data);
    this.logger.log('**************');
    */

  }
  private parseDatavertical(){
    this.logger.log('**************');
    this.logger.log('FLOW-CHART - parseData');
    this.logger.log('**************');
    this.logger.dir(this.service.data);
    this.logger.log('**************');
    const data_w = this.service.data.w.data;
    const data_h = this.service.data.h.data;
    this.logger.log('W:');
    this.logger.dir(data_w);
    this.logger.log('H:');
    this.logger.dir(data_h);
    this.logger.log('**************');
    this.nodes = [];
    this.ids = [];
    this.data = [];

    const col_primary = '#3376C4';
    const col_secondary = '#8c8c8c';
    const col_zero = '#bdbdbd';

    const colorScale = scaleLinear<string>().domain([0, 100]).range([col_zero, col_secondary]);

    this.direction = data_h.length==1?1:-1;

    //home
    for(let i:number=0;i<data_h.length;i++){
      const ob = data_h[i];
      //{name: 'Jēkabpils novads', value: 440, pct: 22.5}
      const L:number = this.nodes.push({id:ob.name, color:data_h.length>1?colorScale(ob.pct):col_primary,dataLabels: {
          align: 'left',
          enabled: true,
          rotation: data_h.length>1?0:-90
        }});
      this.ids[L-1] = ob.name;
    }
    //work
    for(let i:number=0;i<data_w.length;i++){
      const ob = data_w[i];
      //{name: 'Jēkabpils novads', value: 440, pct: 22.5}
      const L:number = this.nodes.push({id:ob.name,color:data_w.length>1?colorScale(ob.pct):col_primary, dataLabels: {
          align: 'right',
          enabled: true,
          rotation: data_w.length>1?0:-90
        }});
      this.ids[L-1] = ob.name;
    }
    // {name: 'Balvu novads', value: 19, pct: 1}
    if(data_w.length>1){
      for(let i:number=0;i<data_w.length;i++){
        const ob = data_w[i];
        this.data.push([data_h[0].name, ob.name, ob.value, ob.value]);
      }
    }else{
      for(let i:number=0;i<data_h.length;i++){
        const ob = data_h[i];
        this.data.push([ob.name, data_w[0].name, ob.value, ob.value]);
      }
    }

    /*
    this.logger.log('**************');
    this.logger.log('nodes:');
    this.logger.dir(this.nodes);
    this.logger.log('data:');
    this.logger.dir(this.data);
    this.logger.log('**************');
    */

  }


  @HostListener('window:resize', ['$event'])
  onHostResize(event:Event){
    this.resize();
  }
  private resize(){
    if(this.visible==true){
      this.mobile = this.compRef.element.nativeElement.offsetWidth<this.MOBILE_SIZE?true:false;
    }


    if(this.service.data!==null){
      if(this.mobile==false){
        this.parseData('horizontal');
        this.drawChart('horizontal');
      }else{
        this.parseData('vertical');
        this.drawChart('vertical');
      }
    }
  }
}

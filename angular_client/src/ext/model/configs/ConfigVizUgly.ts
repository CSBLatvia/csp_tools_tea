export class ConfigVizUgly {

  public strokeColor_w:string;
  public strokeColor_h:string;

  public strokeWidth:number;
  public maxCircleDiameterPercentage:number;
  public minCircleRadius:number;

  constructor(){}
  public initialize(data:any):void{

    this.strokeColor_w = data.strokeColor_w;
    this.strokeColor_h = data.strokeColor_h;

    this.strokeWidth = parseFloat(data.strokeWidth);
    this.maxCircleDiameterPercentage = parseFloat(data.maxCircleDiameterPercentage);
    this.minCircleRadius = parseFloat(data.minCircleRadius);
  }
  public strokeColor(m1:string):string{
    return  m1==='w'?this.strokeColor_w:this.strokeColor_h;
  }

  public strokeColorInvert(m1:string):string{
    return  m1==='w'?this.strokeColor_h:this.strokeColor_w;
  }
}

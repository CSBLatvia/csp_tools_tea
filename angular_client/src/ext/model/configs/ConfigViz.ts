export class ConfigViz {

  public viz_fill_color_w:string;
  public viz_fill_color_h:string;

  public viz_stroke_color_w:string;
  public viz_stroke_color_h:string;

  public viz_fill_alpha:number = 0;
  public viz_stroke_min:number = 2;
  public viz_stroke_max:number = 2;
  public viz_radius_min:number = 2;
  public viz_radius_max:number = 2;

  public ring:boolean = false;
  public ringSizeFrom:number = 1;
  public ringSizePercentage:number = 1;

  constructor(){}
  public initialize(data:any):void{
    this.viz_fill_color_w = data.viz_fill_color_w;
    this.viz_fill_color_h = data.viz_fill_color_h;

    this.viz_fill_alpha = parseFloat(data.viz_fill_alpha);

    this.viz_stroke_color_w = data.viz_stroke_color_w;
    this.viz_stroke_color_h = data.viz_stroke_color_h;

    this.viz_stroke_min = parseFloat(data.viz_stroke.split(',')[0]+'');
    this.viz_stroke_max = parseFloat(data.viz_stroke.split(',')[1]+'');

    this.viz_radius_min = parseFloat(data.viz_radius.split(',')[0]+'');
    this.viz_radius_max = parseFloat(data.viz_radius.split(',')[1]+'');

    this.ring =  data.ring as boolean;
    this.ringSizeFrom = parseFloat(data.ringSizeFrom);
    this.ringSizePercentage = parseFloat(data.ringSizePercentage);


  }
  public fillColor(m1:string):string{
    return  m1==='w'?this.viz_fill_color_w:this.viz_fill_color_h;
  }
  public strokeColor(m1:string):string{
    return  m1==='w'?this.viz_stroke_color_w:this.viz_stroke_color_h;
  }
}

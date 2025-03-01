
export class ConfigMapColors{

  public map_colors_w:Array<any>=[];
  public map_colors_h:Array<any>=[];
  public map_border_color_w:string='';
  public map_border_color_h:string='';
  public territory_border_color:string='';


  public map_colors:Array<string>=[];
  public map_border_color:string='';
  public map_no_value_color:string='';
  public map_zero_color:string;

  constructor(){}
  public initialize(data:any):void{
    let arr:Array<string>;
    data.map_colors_w.forEach((item:string)=>{
      arr = item.split(',');
      this.map_colors_w.push(arr);
    });
    data.map_colors_h.forEach((item:string)=>{
      arr = item.split(',');
      this.map_colors_h.push(arr);
    });

    this.map_border_color_w = data.map_border_color_w;
    this.map_border_color_h = data.map_border_color_h;
    this.map_no_value_color = data.map_no_value_color;
    this.map_zero_color = data.map_zero_color;

    this.map_colors = this.map_colors_w;
    this.map_border_color = this.map_border_color_w;
    this.territory_border_color = data.territory_border_color;
  }
  public choroColors(m1:string):Array<string>{
    return  m1==='w'?this.map_colors_w:this.map_colors_h;
  }
  public borderColor(m1:string):string{
    return  m1==='w'?this.map_border_color_w:this.map_border_color_h;
  }
}

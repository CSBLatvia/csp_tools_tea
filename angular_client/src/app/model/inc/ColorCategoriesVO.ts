export class ColorCategoriesVO {

  public property:string;
  public order:number;
  public count:number;
  public color_index:number;
  public color:string;

  constructor(property:string, order:number, count:number, color_index:number,color:string) {
    this.property = property;
    this.order = order;
    this.count = count;
    this.color_index = color_index;
    this.color = color;
  }
}

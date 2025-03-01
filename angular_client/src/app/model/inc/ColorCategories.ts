import {ColorCategoriesVO} from './ColorCategoriesVO';

export class ColorCategories {

  private colors:Array<string>=[];
  public items:Array<ColorCategoriesVO>=[];
  public items_ids:Array<string> = [];


  constructor(str:string) {
      this.colors = str.split(',');
  }

  public generatePropertyColors(data:Array<any>):void{

    let other:ColorCategoriesVO = null;
    let other_count:number = 0;
    this.items = [];
    this.items_ids = [];

    data = data.sort(function (a: any, b: any) {  return a.order - b.order; });
    data.forEach((item:any)=>{
        const property_id:string = item.display_property_id;

        if(this.items_ids.indexOf(property_id)===-1) {
          if(property_id!=='other') {
            this.items.push(new ColorCategoriesVO(property_id, item.order, item.count, item.color_code - 1, this.colors[item.color_code - 1]));
            this.items_ids.push(property_id);
          }else {
            other_count+=item.count;
            other = new ColorCategoriesVO('other', 9999, other_count, item.color_code - 1, this.colors[item.color_code - 1]);
          }
        }
    });
    if(other!==null){
      this.items.push(other);
      this.items_ids.push('other');
    }

  }
  public getColorByProperty(propertyID:string):string{
    const index:number = this.items_ids.indexOf(propertyID);
    const vo:ColorCategoriesVO = this.items[index];
    return vo.color;
  }
}

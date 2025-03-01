export class VizCircleVO{

    public isParent:boolean = false; // parent, child
    public picking_color:string = '#000000';
    public code:string;
    public value_area:number;
    public choro_value:number;

    public x:number = 0;
    public y:number = 0;

    public percentageFromData:number=0;

    constructor(code:string,value_area:number,choro_value:number = 0,isParent:boolean = false){
        this.code = code;
        this.value_area = value_area;
        this.isParent = isParent;
        this.choro_value = choro_value;
    }
    public toString():string{
      return this.code+':'+this.x+':'+this.y+':'+this.value_area+':'+this.picking_color+':'+this.isParent;
    }
}

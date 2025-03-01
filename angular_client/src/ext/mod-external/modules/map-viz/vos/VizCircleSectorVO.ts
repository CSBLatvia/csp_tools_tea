export class VizCircleSectorVO{

    public isParent:boolean = false; // parent, child
    public code:string;
    public value:number;
    public value_total:number;
    public choro_value:number;

    public property_id:string;
    public property_color:string = '#ff0000';
    public picking_color:string = '#000000';
    public x:number = 0;
    public y:number = 0;
    public sql:string='';

    public percentage:number = -1;

    public degrees:number = -1;
    public radians:number = -1;
    public percentageFromData:number=0;

    constructor(code:string,value:number, value_total:number, choro_value:number = 0, property_id:string='', isParent:boolean = false){
        this.code = code;
        this.value = value;
        this.value_total = value_total;
        this.choro_value = value_total;

        this.property_id = property_id;
        this.isParent = isParent;

        this.percentage = value*100/value_total;
        this.degrees = this.percentage*360*0.01;
        this.radians = this.degrees* Math.PI / 180;
    }
}

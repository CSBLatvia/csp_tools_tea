export class Utils {

  public static angleToRadians(value:number):number{
    return value* Math.PI / 180;
  }
  public static radiusFromArea(value:number):number{
    return Math.sqrt(value/Math.PI);
  }
  public static  sectorLength(degrees:number,radius:number):number{
    return  degrees* Math.PI / 180 * radius;
  }
  public static hexToRGBA(hex:string, alpha:number=1):string {
    const r:number = parseInt(hex.slice(1, 3), 16),
      g:number = parseInt(hex.slice(3, 5), 16),
      b:number = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }

  public static prettyNumber(value:number,lang:string='lv'):string{
      if(value > 999 && value < 1000000){
        return (value/1000).toFixed(2) + (lang==='en'?' K':' tūkst.');
      }else if(value > 1000000){
        return (value/1000000).toFixed(2) + (lang==='en'?' M':' milj.');
      }else if(value < 900){
        return value % 1 === 0?value+'':value.toFixed(2);
      }else{
        return value+'';
      }
  }
  public static randomColor():string{
    const color:string = Math.floor(Math.random()*16777215).toString(16)+'';
    return color;
  }
  public static randRange(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

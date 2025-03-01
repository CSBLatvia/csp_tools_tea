import {ClusterVO} from './ClusterVO';

export class AllClustersVO {

  public items:Array<ClusterVO>=[];
  private values:Array<number>=[];
  private valuesIndexes:Array<number>=[];
  private colors:Array<any>;


  constructor(clusterData:Array<any>,colorsData:Array<any>) {
    this.colors = colorsData;
    function checkPrecision(value:string,previousMax:number):number{
          const arr:Array<any> = (value+'').split('.');
          if(arr.length===2){
            return Math.max(arr[1].toString().length,previousMax);
          }else{
            return previousMax;
          }
        }

    const colors:Array<any> = this.colors[clusterData.length-1];
      let i:number=0;
      let maxPrecision:number=0;

      clusterData.forEach((item:any)=>{
        maxPrecision =  checkPrecision(item[0],maxPrecision);
        maxPrecision =  checkPrecision(item[1],maxPrecision);
      });

      clusterData.forEach((item:any)=>{
        this.items.push(new ClusterVO(item[0],item[1],i,colors[i],maxPrecision));
        i++;
      });
  }
  public addValue(value:number):void{
    if(this.values.indexOf(value)!==-1){return;}

    if(value >= 0){
      this.values.push(value);
      let index:number=-1;
      this.items.forEach((item:ClusterVO)=>{
        const inside:boolean = item.hasValueInside(value);
        if(inside===true){
          index = item.index;
        }
      });
      this.valuesIndexes.push(index);
    }

  }
  public getColorByValue=(value:number):string=>{
    const valueIndex:number = this.values.indexOf(value);
    if(valueIndex!==-1){
      const clusterIndex:number = this.valuesIndexes[valueIndex];
      return this.items[clusterIndex].color;
    }else{
      return '#ff0000';
    }
  }

}

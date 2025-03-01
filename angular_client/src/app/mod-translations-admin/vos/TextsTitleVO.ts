export class TextsTitleVO{

  public r_id:string;
  public home_work:string;
  public indicator_type:string;
  public selected_territ:string;
  public indicator_selected:string;
  public breakdown_selected:string;
  public meta_title_main_lv:string;
  public meta_title_main_en:string;
  public map_title_lv:string;
  public map_title_en:string;
  public table_title_lv:string;
  public table_title_en:string;
  public legend_clusters_title_lv:string;
  public legend_clusters_title_en:string;
  public legend_sizes_title_lv:string;
  public legend_sizes_title_en:string;
  public legend_circles_title_lv:string;
  public legend_circles_title_en:string;
  public table_col_1_title_lv:string;
  public table_col_1_title_en:string;
  public table_col_2_title_lv:string;
  public table_col_2_title_en:string;
  public table_col_3_title_lv:string;
  public table_col_3_title_en:string;
  public legend_list_title_lv:string;
  public legend_list_title_en:string;
  public meta_description_main_lv:string;
  public meta_description_main_en:string;




  constructor(
  r_id:string,
  home_work:string,
  indicator_type:string,
  selected_territ:string,
  indicator_selected:string,
  breakdown_selected:string,
  meta_title_main_lv:string,
  meta_title_main_en:string,
  map_title_lv:string,
  map_title_en:string,
  table_title_lv:string,
  table_title_en:string,
  legend_clusters_title_lv:string,
  legend_clusters_title_en:string,
  legend_sizes_title_lv:string,
  legend_sizes_title_en:string,
  legend_circles_title_lv:string,
  legend_circles_title_en:string,
  table_col_1_title_lv:string,
  table_col_1_title_en:string,
  table_col_2_title_lv:string,
  table_col_2_title_en:string,
  table_col_3_title_lv:string,
  table_col_3_title_en:string,
  legend_list_title_lv:string,
  legend_list_title_en:string,
  meta_description_main_lv:string,
  meta_description_main_en:string

  ) {
    this.r_id = r_id;
    this.home_work = this.checkNull(home_work);
    this.indicator_type = this.checkNull(indicator_type);
    this.selected_territ = this.checkNull(selected_territ);
    this.indicator_selected = this.checkNull(indicator_selected);
    this.breakdown_selected = this.checkNull(breakdown_selected);
    this.meta_title_main_lv = this.checkNull(meta_title_main_lv);
    this.meta_title_main_en = this.checkNull(meta_title_main_en);
    this.map_title_lv = this.checkNull(map_title_lv);
    this.map_title_en = this.checkNull(map_title_en);
    this.table_title_lv = this.checkNull(table_title_lv);
    this.table_title_en = this.checkNull(table_title_en);
    this.legend_clusters_title_lv = this.checkNull(legend_clusters_title_lv);
    this.legend_clusters_title_en = this.checkNull(legend_clusters_title_en);
    this. legend_sizes_title_lv = this.checkNull(legend_sizes_title_lv);
    this.legend_sizes_title_en = this.checkNull(legend_sizes_title_en);
    this.legend_circles_title_lv = this.checkNull(legend_circles_title_lv);
    this.legend_circles_title_en = this.checkNull(legend_circles_title_en);
    this.table_col_1_title_lv = this.checkNull(table_col_1_title_lv);
    this.table_col_1_title_en = this.checkNull(table_col_1_title_en);
    this.table_col_2_title_lv = this.checkNull(table_col_2_title_lv);
    this.table_col_2_title_en = this.checkNull(table_col_2_title_en);
    this.table_col_3_title_lv = this.checkNull(table_col_3_title_lv);
    this.table_col_3_title_en = this.checkNull(table_col_3_title_en);
    this.legend_list_title_lv = this.checkNull(legend_list_title_lv);
    this.legend_list_title_en = this.checkNull(legend_list_title_en);
    this.meta_description_main_lv = this.checkNull(meta_description_main_lv);
    this.meta_description_main_en = this.checkNull(meta_description_main_en);
  }
  public clone():TextsTitleVO{
    const vo:TextsTitleVO = new TextsTitleVO(
      this.r_id,
      this.home_work,
      this.indicator_type,
      this.selected_territ,
      this.indicator_selected,
      this.breakdown_selected,
      this.meta_title_main_lv,
      this.meta_title_main_en,
      this.map_title_lv,
      this.map_title_en,
      this.table_title_lv,
      this.table_title_en,
      this.legend_clusters_title_lv,
      this.legend_clusters_title_en,
      this.legend_sizes_title_lv,
      this.legend_sizes_title_en,
      this.legend_circles_title_lv,
      this.legend_circles_title_en,
      this.table_col_1_title_lv,
      this.table_col_1_title_en,
      this.table_col_2_title_lv,
      this.table_col_2_title_en,
      this.table_col_3_title_lv,
      this.table_col_3_title_en,
      this.legend_list_title_lv,
      this.legend_list_title_en,
      this.meta_description_main_lv,
      this.meta_description_main_en
    );
    return vo;
  }
  public checkNull=(value:any):string=>{
    return value==null?'':value+'';
  }
}

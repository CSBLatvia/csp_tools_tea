// import {TerritoryNameVO} from "./TerritoryNameVO";

export class SelectedDataVO {


  public region:any; //TerritoryNameVO - is missing, is used?
  public age_1: number;
  public age_2: number;
  public arzemes: number;
  public arzemes_pct: number;
  public citur_lv: number;
  public citur_lv_pct: number;
  public code: string;
  public level: number;
  public mirusi: number;
  public mirusi_pct: number;
  public no_arzemem: number;
  public no_arzemem_pct: number;
  public no_citurienes_lv: number;
  public no_citurienes_lv_pct: number;
  public piedzimusi: number;
  public piedzimusi_pct: number;
  public total_1: number;
  public total_2: number;
  public turpat: number;
  public turpat_pct: number;
  public year_from: number;
  public year_to: number;


  constructor(
    region:any, // TerritoryNameVO - is missing, is used?
    age_1: number,
    age_2: number,
    arzemes: number,
    arzemes_pct: number,
    citur_lv: number,
    citur_lv_pct: number,
    code: string,
    level: number,
    mirusi: number,
    mirusi_pct: number,
    no_arzemem: number,
    no_arzemem_pct: number,
    no_citurienes_lv: number,
    no_citurienes_lv_pct: number,
    piedzimusi: number,
    piedzimusi_pct: number,
    total_1: number,
    total_2: number,
    turpat: number,
    turpat_pct: number,
    year_from: number,
    year_to: number
  ){
      this.region = region;
      this.age_1 = age_1;
      this.age_2 = age_2;
      this.arzemes = arzemes;
      this.arzemes_pct = arzemes_pct;
      this.citur_lv = citur_lv;
      this.citur_lv_pct = citur_lv_pct;
      this.code = code;
      this.level = level;
      this.mirusi = mirusi;
      this.mirusi_pct = mirusi_pct;
      this.no_arzemem = no_arzemem;
      this.no_arzemem_pct = no_arzemem_pct;
      this.no_citurienes_lv = no_citurienes_lv;
      this.no_citurienes_lv_pct = no_citurienes_lv_pct;
      this.piedzimusi = piedzimusi;
      this.piedzimusi_pct = piedzimusi_pct;
      this.total_1 = total_1;
      this.total_2 = total_2;
      this.turpat = turpat;
      this.turpat_pct = turpat_pct;
      this.year_from = year_from;
      this.year_to = year_to;
  }

}

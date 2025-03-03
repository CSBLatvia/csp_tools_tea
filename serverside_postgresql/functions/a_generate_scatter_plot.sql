CREATE OR REPLACE FUNCTION tea.a_generate_scatter_plot(
  _lang text,
  _year integer,
  _m1 text,
  _m2 text,
  _m3 text,
  _m4 text,
  _t1 integer,
  _t2 text,
  _x text,
  _y text)
    RETURNS TABLE(r_t json, debug json) 
    LANGUAGE 'plpgsql'
    COST 1000
    STABLE PARALLEL RESTRICTED 
    ROWS 100

AS $BODY$

--_m1 - darba/dzīves vieta.
--_m2 - rādītājs (darbvietu vai nodarbināto skaits, pievienotā vērtība, produkcijas vērtība).
--_m3 - nozare, profesija vai sektors.
--_m4 - izvēlētā m3 kods.
--_t1 - teritorijas veids (0 - Latvija, 3 - novadi un valstpilsētas, 4 - pagasti un pilsētas, 7 - blīvi apdzīvotas teritorijas).
--_t2 - teritorijas kods atbilstoši teritorijas veidam.
--_x - kods X asij.
--_y - kods Y asij.

DECLARE _params_all_text_string text;
_return_text_string text;
_data_execute record;
_data_execute_2 record;
_level_w int;
_level_h int;
_code_w text;
_code_h text;
_brdwn text;
_brdwn_code text;
_value_code text;
_error_msg text;
_error_detail text;
_error_hint text;
_sql_main text;
_y_v text;
_x_v text;
_y_sql text;
_x_sql text;
_sql_final text;
_hw_mod text;
_r_id int;

--Testēšanai.
--SELECT * FROM tea.a_generate_scatter_plot('lv', 2017, 'w', 'e', '', '', '3', 'all', 'va_w', 'empl_wp_100');
--SELECT * FROM tea.a_generate_scatter_plot('lv', 2017, 'w', 'e', '', '', '3', 'all', 'va_w', 'wp');
--SELECT * FROM tea.a_generate_scatter_plot('lv', 2017, 'w', 'e', '', '', '3', 'all', 'va_wp', 'wp');
--SELECT * FROM tea.a_generate_scatter_plot('lv', 2017, 'h', 'e', '', '', '3', 'all', 'va_h', 'empl');
--SELECT * FROM tea.a_generate_scatter_plot('lv', 2017, 'h', 'e', '', '', '3', 'all', 'va_h', 'empl_level');

BEGIN

EXECUTE 'SELECT scatter_axis_code
  ,scatter_axis_sql
FROM tea.texts_scatter_axis_menu
WHERE scatter_axis = ''x''
  AND scatter_axis_code = $1;'
INTO _x_v
  ,_x_sql
USING _x;

IF _x_v IS NULL
  THEN RAISE EXCEPTION 'Neksistējošs [_x] kods %'
    ,_x;
END IF;

RAISE NOTICE '_x_sql: %, %'
  ,_x
  ,_x_sql;

EXECUTE 'SELECT scatter_axis_code
  ,scatter_axis_sql
FROM tea.texts_scatter_axis_menu
WHERE scatter_axis = ''y''
  AND scatter_axis_code = $1;'
INTO _y_v
  ,_y_sql
USING _y;

IF _y_v IS NULL
  THEN RAISE EXCEPTION 'Neeksistējošs [_y] kods %'
  ,_y;
END IF;

RAISE NOTICE '_y_sql: % %'
  ,_y
  ,_y_sql;

_hw_mod := _m1;
_brdwn_code := _m4;

--Parametru pārveide, lai atbilstu datubāzē izmantotajiem.
IF _t2 = 'all'
  THEN _t2 := 'LV';
END IF;

CASE
  WHEN _m3 = 'i'
    THEN _brdwn := 'nace';
  WHEN _m3 = 'p'
    THEN _brdwn := 'prof';
  WHEN _m3 = 's'
    THEN _brdwn := 'sector';
  ELSE _brdwn := 'total';
  /*_error_msg := CONCAT (
    _error_msg
    ,'_m3 vērtības neeksistējošas.'
    );*/
  END CASE;

CASE
  WHEN _m2 = 'av'
    THEN _value_code := 'value_added';
  WHEN _m2 = 'e'
    THEN
      IF _m1 = 'w'
        THEN _value_code := 'empl_w';
      ELSE _value_code := 'empl';
      END IF;
  WHEN _m2 = 'vp'
    THEN _value_code := 'value_prod';
  ELSE
  /*_error_msg := CONCAT (
    _error_msg
    ,'_m2 vērtības neeksistējošas.'
    );*/
  END CASE;

---Home/work parametru apstrāde.
CASE
  WHEN _m1 = 'w'
    AND _t2 = 'LV'
    THEN _level_w := _t1;
      _level_h := 99;
      --_code_w := _t2;
      _code_h := 'total';
  WHEN _m1 = 'h'
    AND _t2 = 'LV'
    THEN _level_h := _t1;
      _level_w := 99;
      --_code_h := _t2;
      _code_w := 'total';
  WHEN _m1 = 'w'
    AND _t2 != 'LV'
    THEN _level_w := _t1;
      --_level_h := _t1;
      _code_w := _t2;
      _hw_mod := 'h';
  WHEN _m1 = 'h'
    AND _t2 != 'LV'
    THEN _level_h := _t1;
      --_level_w := _t1;
      _code_h := _t2;
      _hw_mod := 'w';
  ELSE
  END CASE;

IF _brdwn_code = 'none'
  THEN _brdwn_code := 'total';
END IF;

--Vaicājuma konstruēšana.
_sql_main := CONCAT ('WITH y_sc
AS (
  ', _y_sql, '
  )
  ,x_sc
AS (
  ', _x_sql, '
  )
  ,scatter_chart_data
AS (
  SELECT ''scatter_chart_data'' r_name
    ,json_agg(json_build_object(
      ''year'', x.year
      ,''level'', x.level
      ,''code'', x.code
      ,''value_x'', x.value_ind
      ,''value_y'', y.value_ind
      )) r_t
  FROM x_sc x
  JOIN y_sc y ON x.year = y.year
    AND x.level = y.level
    AND x.code = y.code
  )
  ,scatter_chart_texts
AS (
  SELECT ''scatter_texts'' r_name
    ,json_build_object(
      ''chart_title_lv'', at.chart_title_lv
      ,''chart_title_en'', at.chart_title_en
      ,''x_axis_title_lv'', ax.scatter_axis_title_lv
      ,''x_axis_title_en'', ax.scatter_axis_title_en
      ,''y_axis_title_lv'', ay.scatter_axis_title_lv
      ,''y_axis_title_en'', ay.scatter_axis_title_en
      ) r_t
  FROM tea.texts_scatter_titles at
  LEFT JOIN tea.texts_scatter_axis_menu ax ON ax.scatter_axis = ''x''
    AND ax.scatter_axis_code = at.x_axis_code
  LEFT JOIN tea.texts_scatter_axis_menu ay ON ay.scatter_axis = ''y''
    AND ay.scatter_axis_code = at.y_axis_code
  WHERE at.y_axis_code = $10
    AND at.x_axis_code = $9
  )
SELECT json_build_object(
  ''scatter_chart_set''
  ,json_object_agg(
    z.r_name
    ,z.r_t
    )
  ) r_t
FROM (
  SELECT r_name
    ,r_t
  FROM scatter_chart_texts
  
  UNION ALL
  
  SELECT r_name
    ,r_t
  FROM scatter_chart_data
  ) z');

RAISE NOTICE 'year = %, _level_h = %, _code_h = %, _level_w = %, _code_w = %, _brdwn = %, _brdwn_code = %, _value_code = %'
  ,_year
  ,_level_h
  ,_code_h
  ,_level_w
  ,_code_w
  ,_brdwn
  ,_brdwn_code
  ,_value_code;

EXECUTE _sql_main
INTO _data_execute
USING _year
  ,_level_h
  ,_code_h
  ,_level_w
  ,_code_w
  ,_brdwn
  ,_brdwn_code
  ,_value_code
  ,_x
  ,_y;

RAISE NOTICE 'sql_main: %'
  ,_sql_main;

RETURN query
SELECT _data_execute.r_t r_t
  ,json_build_object('SQL_code', _sql_main) debug;

EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS _error_msg  = MESSAGE_TEXT
      ,_error_detail = PG_EXCEPTION_CONTEXT
      ,_error_hint = PG_EXCEPTION_DETAIL;

RETURN query
SELECT json_build_object('error_msg', _error_msg, 'error_detail', _error_detail, 'error_hint', _error_hint) r_t
  ,json_build_object('SQL_code', _sql_main) debug;

END;
$BODY$;

REVOKE ALL
  ON FUNCTION tea.a_generate_scatter_plot(TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT, TEXT)
  FROM public;
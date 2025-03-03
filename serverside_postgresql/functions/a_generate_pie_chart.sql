CREATE OR REPLACE FUNCTION tea.a_generate_pie_chart(
  _lang text,
  _year integer,
  _m1 text,
  _m2 text,
  _m3 text,
  _m4 text,
  _t1 integer,
  _t2 text,
  _request_type text)
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

DECLARE _texts_execute RECORD;
_data_execute RECORD;
_level_w INT;
_level_h INT;
_code_w TEXT;
_code_h TEXT;
_level_w_sel INT;
_level_h_sel INT;
_code_w_sel TEXT;
_code_h_sel TEXT;
_level_w_lv INT;
_level_h_lv INT;
_code_w_lv TEXT;
_code_h_lv TEXT;
--_brdwn TEXT;
--_brdwn_code TEXT;
_value_code TEXT;
_error_msg TEXT;
_error_detail TEXT;
_error_hint TEXT;
_sql_main TEXT;

--Testēšanai.
--SELECT tea.a_generate_pie_chart('lv', 2017, 'w', 'e', 'total', 'none', 3, 'LV0023000', 'in');
--SELECT tea.a_generate_pie_chart('lv', 2017, 'w', 'av', 'total', 'none', 3, 'LV0023000', 'in');
--SELECT tea.a_generate_pie_chart('lv', 2017, 'h', 'e', 'total', 'none', 3, 'LV0023000', 'in');
--SELECT tea.a_generate_pie_chart('lv', 2017, 'h', 'av', 'total', 'none', 3, 'LV0023000', 'in');
--SELECT tea.a_generate_pie_chart('lv', 2017, 'w', 'e', 'total', 'none', 3, 'all', 'in');
--SELECT tea.a_generate_pie_chart('lv', 2017, 'w', 'av', 'total', 'none', 3, 'all', 'in'); --Rīkā neiekļauts.
--SELECT tea.a_generate_pie_chart('lv', 2017, 'h', 'e', 'total', 'none', 3, 'all', 'in');
--SELECT tea.a_generate_pie_chart('lv', 2017, 'h', 'av', 'total', 'none', 3, 'all', 'in'); --Rīkā neiekļauts.
--SELECT tea.a_generate_pie_chart('en', 2017, 'w', 'e', 'total', 'none', 3, 'LV0023000', 'in');
--SELECT tea.a_generate_pie_chart('en', 2017, 'w', 'av', 'total', 'none', 3, 'LV0023000', 'in');
--SELECT tea.a_generate_pie_chart('en', 2017, 'h', 'e', 'total', 'none', 3, 'LV0023000', 'in');
--SELECT tea.a_generate_pie_chart('en', 2017, 'h', 'av', 'total', 'none', 3, 'LV0023000', 'in');
--SELECT tea.a_generate_pie_chart('en', 2017, 'w', 'e', 'total', 'none', 3, 'all', 'in');
--SELECT tea.a_generate_pie_chart('en', 2017, 'w', 'av', 'total', 'none', 3, 'all', 'in'); --Rīkā neiekļauts.
--SELECT tea.a_generate_pie_chart('en', 2017, 'h', 'e', 'total', 'none', 3, 'all', 'in');
--SELECT tea.a_generate_pie_chart('en', 2017, 'h', 'av', 'total', 'none', 3, 'all', 'in'); --Rīkā neiekļauts.
--SELECT tea.a_generate_pie_chart('lv', 2017, 'w', 'e', 'total', 'none', 3, 'LV0023000', 'out');
--SELECT tea.a_generate_pie_chart('lv', 2017, 'w', 'av', 'total', 'none', 3, 'LV0023000', 'out');
--SELECT tea.a_generate_pie_chart('lv', 2017, 'h', 'e', 'total', 'none', 3, 'LV0023000', 'out');
--SELECT tea.a_generate_pie_chart('lv', 2017, 'h', 'av', 'total', 'none', 3, 'LV0023000', 'out');
--SELECT tea.a_generate_pie_chart('lv', 2017, 'w', 'e', 'total', 'none', 3, 'all', 'out');
--SELECT tea.a_generate_pie_chart('lv', 2017, 'w', 'av', 'total', 'none', 3, 'all', 'out'); --Rīkā neiekļauts.
--SELECT tea.a_generate_pie_chart('lv', 2017, 'h', 'e', 'total', 'none', 3, 'all', 'out');
--SELECT tea.a_generate_pie_chart('lv', 2017, 'h', 'av', 'total', 'none', 3, 'all', 'out'); --Rīkā neiekļauts.
--SELECT tea.a_generate_pie_chart('en', 2017, 'w', 'e', 'total', 'none', 3, 'LV0023000', 'out');
--SELECT tea.a_generate_pie_chart('en', 2017, 'w', 'av', 'total', 'none', 3, 'LV0023000', 'out');
--SELECT tea.a_generate_pie_chart('en', 2017, 'h', 'e', 'total', 'none', 3, 'LV0023000', 'out');
--SELECT tea.a_generate_pie_chart('en', 2017, 'h', 'av', 'total', 'none', 3, 'LV0023000', 'out');
--SELECT tea.a_generate_pie_chart('en', 2017, 'w', 'e', 'total', 'none', 3, 'all', 'out');
--SELECT tea.a_generate_pie_chart('en', 2017, 'w', 'av', 'total', 'none', 3, 'all', 'out'); --Rīkā neiekļauts.
--SELECT tea.a_generate_pie_chart('en', 2017, 'h', 'e', 'total', 'none', 3, 'all', 'out');
--SELECT tea.a_generate_pie_chart('en', 2017, 'h', 'av', 'total', 'none', 3, 'all', 'out'); --Rīkā neiekļauts.

BEGIN

--Parametru pārveide, lai atbilstu datubāzē izmantotajiem.
/*
_brdwn_code := _m4;

IF _brdwn_code = 'none'
  THEN _brdwn_code := 'total';
END IF;
*/

IF _t2 = 'all'
  THEN _t2 := 'LV';
END IF;

---Nedefinē mainīgo 100 argumentu limita dēļ.
/*
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
*/

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
    THEN _level_w := 0;
      _level_h := 99;
      _code_w := _t2;
      _code_h := 'total';
  WHEN _m1 = 'h'
    AND _t2 = 'LV'
    THEN _level_h := 0;
      _level_w := 99;
      _code_h := _t2;
      _code_w := 'total';
  WHEN _m1 = 'w'
    AND _t2 != 'LV'
    THEN _level_w := _t1;
      _level_h := 99;
      _code_w := _t2;
      _code_h := 'total';
  WHEN _m1 = 'h'
    AND _t2 != 'LV'
    THEN _level_h := _t1;
      _level_w := 99;
      _code_h := _t2;
      _code_w := 'total';
  ELSE
  END CASE;

----Home/work parametru apstrāde tās pašas teritorijas iedzīvotājiem/nodarbinātajiem un ārpus teritorijas dzīvojošajiem/strādājošajiem.
CASE 
    WHEN _request_type = 'in'
      AND _m1 = 'w'
      THEN _level_w_sel = _level_w;
        _level_h_sel = _level_w;
        _code_w_sel = _code_w;
        _code_h_sel = _code_w;
    WHEN _request_type = 'in'
      AND _m1 = 'h'
      THEN _level_w_sel = _level_h;
        _level_h_sel = _level_h;
        _code_w_sel = _code_h;
        _code_h_sel = _code_h;
    WHEN _request_type = 'out'
      AND _m1 = 'w'
      THEN _level_w_sel = _level_w;
        _level_h_sel = 99;
        _code_w_sel = _code_w;
        _code_h_sel = 'out';
    WHEN _request_type = 'out'
      AND _m1 = 'h'
      THEN _level_w_sel = 99;
        _level_h_sel = _level_h;
        _code_w_sel = 'out';
        _code_h_sel = _code_h;
    ELSE
    END CASE;

----Home/work parametru apstrāde priekš b_lv_out.
CASE 
    WHEN _request_type = 'in'
      AND _m1 = 'w'
      THEN _level_w_lv = _t1;
        _level_h_lv = _t1;
        _code_w_lv = 'code_h';
        _code_h_lv = 'code_w';
    WHEN _request_type = 'in'
      AND _m1 = 'h'
      THEN _level_w_lv = _t1;
        _level_h_lv = _t1;
        _code_w_lv = 'code_h';
        _code_h_lv = 'code_w';
    WHEN _request_type = 'out'
      AND _m1 = 'w'
      THEN _level_w_lv = _t1;
        _level_h_lv = 99;
        _code_w_lv = '''%''';
        _code_h_lv = '''out''';
    WHEN _request_type = 'out'
      AND _m1 = 'h'
      THEN _level_w_lv = 99;
        _level_h_lv = _t1;
        _code_w_lv = '''out''';
        _code_h_lv = '''%''';
    ELSE
    END CASE;

--Teksti.
SELECT CASE 
    WHEN _request_type = 'in'
      THEN CASE 
          WHEN _lang = 'lv'
            THEN ext_pie_chart_in_txt_lv
          ELSE ext_pie_chart_in_txt_en
          END
    ELSE CASE 
        WHEN _lang = 'lv'
          THEN ext_pie_chart_out_txt_lv
        ELSE ext_pie_chart_out_txt_en
        END
    END te
INTO _texts_execute
FROM tea.texts_title_ext dt
WHERE dt.home_work = _m1
  AND dt.indicator_type = CASE 
    WHEN _m2 = 'e'
      THEN 'empl'
    ELSE 'other'
    END
  AND dt.selected_territ = CASE 
    WHEN _t2 = 'LV'
      THEN 'all'
    ELSE 'selected'
    END;

--Vaicājuma konstruēšana.
_sql_main := CONCAT ('WITH b
AS (
  SELECT *
  FROM tea.data
  WHERE year = ', _year, '
    AND level_h = ', _level_h_sel, '
    AND code_h = ''', _code_h_sel, '''
    AND level_w = ', _level_w_sel, '
    AND code_w = ''', _code_w_sel, '''
    AND brdwn = ''total'' --Nedefinē ar mainīgo 100 argumentu limita dēļ.
    AND value_code = ''', _value_code, '''
  )
  ,b_lv
AS (
  SELECT SUM(value_ind) value_ind
  FROM tea.data
  WHERE year = ', _year, '
    AND level_h = ', _level_h_lv, '
    AND code_h LIKE ', _code_h_lv, '
    AND level_w = ', _level_w_lv, '
    AND code_w LIKE ', _code_w_lv, '
    AND brdwn = ''total''
    AND value_code = ''', _value_code, '''
  )
  ,empl
AS (
  SELECT SUM(value_ind) value_ind
  FROM tea.data
  WHERE year = ', _year, '
    AND level_h = ', _level_h_lv, '
    AND code_h LIKE ', _code_h_lv, '
    AND level_w = ', _level_w_lv, '
    AND code_w LIKE ', _code_w_lv, '
    AND brdwn = ''total''
    AND value_code = ''empl''
  )
  ,tot
AS (
  SELECT value_ind
  FROM tea.data
  WHERE year = ', _year, '
    AND level_h = ', _level_h, '
    AND code_h = ''', _code_h, '''
    AND level_w = ', _level_w, '
    AND code_w = ''', _code_w, '''
    AND brdwn = ''total''
    AND value_code = ''', _value_code, '''
  )
  ,tot_empl
AS (
  SELECT *
  FROM tea.data
  WHERE year = ', _year, '
    AND level_h = ', _level_h, '
    AND code_h = ''', _code_h, '''
    AND level_w = ', _level_w, '
    AND code_w = ''', _code_w, '''
    AND brdwn = ''total''
    AND brdwn_code = ''total''
    AND value_code = ''empl''
  )
  ,tot_empl_w
AS (
  SELECT *
  FROM tea.data
  WHERE year = ', _year, '
    AND level_h = ', _level_h, '
    AND code_h = ''', _code_h, '''
    AND level_w = ', _level_w, '
    AND code_w = ''', _code_w, '''
    AND brdwn = ''total''
    AND brdwn_code = ''total''
    AND value_code = ''empl_w''
  )
  ,rel
AS (
  SELECT *
  FROM tea.data
  WHERE year = ', _year, '
    AND level_h = ', _level_h_sel, '
    AND code_h = ''', _code_h_sel, '''
    AND level_w = ', _level_w_sel, '
    AND code_w = ''', _code_w_sel, '''
    AND brdwn = ''total''
    AND value_code = ''empl''
  )
  ,rel_w
AS (
  SELECT *
  FROM tea.data
  WHERE year = ', _year, '
    AND level_h = ', _level_h_sel, '
    AND code_h = ''', _code_h_sel, '''
    AND level_w = ', _level_w_sel, '
    AND code_w = ''', _code_w_sel, '''
    AND brdwn = ''total''
    AND value_code = ''empl_w''
  )
  ,c
AS (
  SELECT 1 id
    ,b.value_ind
    ,ROUND((b.value_ind / tot.value_ind * 100), 1) pct
  FROM b
  JOIN tot ON true
  
  UNION
  
  SELECT CASE 
      WHEN ''', _t2, ''' = ''LV''
        THEN 2
      ELSE 0
      END id
    ,b.value_ind
    ,ROUND((b.value_ind / tot.value_ind * 100), 1) pct
  FROM b_lv b
  JOIN tot ON true
  )
  ,c_min
AS (
  SELECT MIN(id) id
  FROM c
  WHERE id > 0
  )
  ,main
AS (
  SELECT c.*
  FROM c
  INNER JOIN c_min ON c.id = c_min.id
  )
SELECT json_strip_nulls(json_build_object(
  ''pie_chart_set'', json_build_object(
    ''data'', (
      SELECT json_agg(json_build_object(
        ''pct'', pct
      ))
      FROM main
      )
    ,''text'', (
      SELECT CONCAT (', _texts_execute.te, ')
      FROM main
      JOIN tot ON true
      LEFT JOIN empl ON true
      LEFT JOIN tot_empl ON true
      LEFT JOIN tot_empl_w ON true
      LEFT JOIN rel ON true
      LEFT JOIN rel_w ON true
      LEFT JOIN tea.get_territory(''', _year, ''', ''', _t1, ''', ''', _t2, ''') t ON true
      LEFT JOIN tea.meta_value_code m_v_c ON m_v_c.value_code = ''', _value_code, '''
      )
    )
  )) r_t;');

RAISE NOTICE 'lang = %, year = %, _level_h = %, _code_h = %, _level_w = %, _code_w = %, _value_code = %'
  ,_lang
  ,_year
  ,_level_h
  ,_code_h
  ,_level_w
  ,_code_w
  --,_brdwn
  ,_value_code;

EXECUTE _sql_main
INTO _data_execute
USING _lang
  ,_year
  ,_level_h
  ,_code_h
  ,_level_w
  ,_code_w
  --,_brdwn
  ,_value_code;

RAISE NOTICE 'sql_main: %'
  ,_sql_main;

RETURN query
SELECT _data_execute.r_t r_t
  ,json_build_object('SQL_code', _sql_main) debug;

EXCEPTION
  WHEN OTHERS
    THEN GET STACKED DIAGNOSTICS _error_msg  = MESSAGE_TEXT
      ,_error_detail = PG_EXCEPTION_CONTEXT
      ,_error_hint = PG_EXCEPTION_DETAIL;

RETURN query
SELECT json_build_object('error_msg', _error_msg, 'error_detail', _error_detail, 'error_hint', _error_hint) r_t
  ,json_build_object('SQL_code', _sql_main) debug;

END;
$BODY$;

REVOKE ALL
  ON FUNCTION tea.a_generate_pie_chart(TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT)
  FROM public;
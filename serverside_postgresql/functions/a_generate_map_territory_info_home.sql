CREATE OR REPLACE FUNCTION tea.a_generate_map_territory_info_home(
  _lang text,
  _year integer,
  _m1 text,
  _m2 text,
  _m3 text,
  _m4 text,
  _t1 integer,
  _t2 text)
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
_value_code_empl TEXT;
_brdwn TEXT;
--_brdwn_code TEXT;
_value_code TEXT;
_error_msg TEXT;
_error_detail TEXT;
_error_hint TEXT;
_sql_main TEXT;
ext_map_territory_info_home_txt1_tmp TEXT;
ext_map_territory_info_home_txt1 TEXT;

--Testēšanai.
--SELECT tea.a_generate_map_territory_info_home('lv', 2017, 'w', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_territory_info_home('lv', 2017, 'h', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_territory_info_home('lv', 2017, 'w', 'e', 's', 'none', 3, 'all');
--SELECT tea.a_generate_map_territory_info_home('lv', 2017, 'h', 'e', 's', 'none', 3, 'all');
--SELECT tea.a_generate_map_territory_info_home('lv', 2017, 'w', 'e', 's', 'none', 7, 'LVDPA0001');
--SELECT tea.a_generate_map_territory_info_home('lv', 2017, 'w', 'e', 's', 'none', 7, 'LVDPA0017');
--SELECT tea.a_generate_map_territory_info_home('lv', 2017, 'h', 'e', 's', 'none', 7, 'LVDPA0001');
--SELECT tea.a_generate_map_territory_info_home('lv', 2017, 'h', 'e', 's', 'none', 7, 'LVDPA0017');
--SELECT tea.a_generate_map_territory_info_home('lv', 2017, 'w', 'e', 's', 'none', 7, 'all');
--SELECT tea.a_generate_map_territory_info_home('lv', 2017, 'h', 'e', 's', 'none', 7, 'all');
--SELECT tea.a_generate_map_territory_info_home('en', 2017, 'w', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_territory_info_home('en', 2017, 'h', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_territory_info_home('en', 2017, 'w', 'e', 's', 'none', 3, 'all');
--SELECT tea.a_generate_map_territory_info_home('en', 2017, 'h', 'e', 's', 'none', 3, 'all');
--SELECT tea.a_generate_map_territory_info_home('en', 2017, 'w', 'e', 's', 'none', 7, 'LVDPA0001');
--SELECT tea.a_generate_map_territory_info_home('en', 2017, 'w', 'e', 's', 'none', 7, 'LVDPA0017');
--SELECT tea.a_generate_map_territory_info_home('en', 2017, 'h', 'e', 's', 'none', 7, 'LVDPA0001');
--SELECT tea.a_generate_map_territory_info_home('en', 2017, 'h', 'e', 's', 'none', 7, 'LVDPA0017');
--SELECT tea.a_generate_map_territory_info_home('en', 2017, 'w', 'e', 's', 'none', 7, 'all');
--SELECT tea.a_generate_map_territory_info_home('en', 2017, 'h', 'e', 's', 'none', 7, 'all');

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

_brdwn := 'total';

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

CASE
  WHEN _m1 = 'w'
    THEN
    _value_code_empl = 'empl_w';
  ELSE
    _value_code_empl = 'empl';
  END CASE;
  
--Teksti.
ext_map_territory_info_home_txt1_tmp := CONCAT ('WITH m
AS (
  SELECT MAX("date") "date"
  FROM web.territories_lv
  WHERE "level" = ', _t1, '
  )
  ,mc
AS (
  SELECT MAX("date") "date"
  FROM web.territories_lv
  WHERE "level" = 4
  )
  ,empl_count_c_w
AS (
  SELECT value_ind
  FROM tea.data a
  LEFT JOIN mc ON true
  LEFT JOIN tea.get_territory(', _year, ', ''', _t1, ''', ''', _t2, ''') t ON true
  LEFT JOIN web.territories_lv_3857 tc ON tc."date" = mc."date"
    AND t.name_lv = tc.name_lv
    AND tc."level" = 4
  WHERE a.year = ', _year, '
    AND a.code_h = ''total''
    AND a.code_w = tc.code
    AND a.value_code = ''', _value_code_empl, '''
    AND a.level_h = 99
    AND a.level_w = 4
    AND a.brdwn = ''', _brdwn, '''
  )
  ,empl_count_c_h
AS (
  SELECT value_ind
  FROM tea.data a
  LEFT JOIN mc ON true
  LEFT JOIN tea.get_territory(', _year, ', ''', _t1, ''', ''', _t2, ''') t ON true
  LEFT JOIN web.territories_lv_3857 tc ON tc."date" = mc."date"
    AND t.name_lv = tc.name_lv
    AND tc."level" = 4
  WHERE a.year = ', _year, '
    AND a.code_h = tc.code
    AND a.code_w = ''total''
    AND a.value_code = ''', _value_code_empl, '''
    AND a.level_h = 4
    AND a.level_w = 99
    AND a.brdwn = ''', _brdwn, '''
  )
SELECT CASE 
    WHEN ''', _lang, ''' = ''lv''
     THEN ext_map_territory_info_home_txt1_lv
    ELSE ext_map_territory_info_home_txt1_en
    END
FROM tea.texts_title_ext_home dt
LEFT JOIN m ON true
LEFT JOIN empl_count_c_w ON true
LEFT JOIN empl_count_c_h ON true
LEFT JOIN tea.get_territory(', _year, ', ''', _t1, ''', ''', _t2, ''') t ON true
LEFT JOIN web.dpa_contents dc ON ''', _t2, ''' = dc.dpa_id and dc."date" = m."date"
LEFT JOIN tea.meta_value_code m_v_c ON m_v_c.value_code = ''', _value_code_empl, '''
WHERE dt.home_work =''', _m1, '''
  AND dt.territory_type =', _t1, '
  AND dt.selected_territ = CASE 
    WHEN ''', _t2, ''' = ''LV''
      THEN ''all''
    ELSE ''selected''
    END');

EXECUTE ext_map_territory_info_home_txt1_tmp
INTO ext_map_territory_info_home_txt1;

SELECT CASE 
    WHEN _lang = 'lv'
      THEN ext_map_territory_info_home_title_lv
    ELSE ext_map_territory_info_home_title_en
    END title
,ext_map_territory_info_home_txt1 txt1
,CASE 
    WHEN _lang = 'lv'
      THEN COALESCE (ext_map_territory_info_home_txt2_lv, '''''')
    ELSE COALESCE (ext_map_territory_info_home_txt2_en, '''''')
    END txt2
,CASE 
    WHEN _lang = 'lv'
      THEN COALESCE (ext_map_territory_info_home_txt3_lv, '''''')
    ELSE COALESCE (ext_map_territory_info_home_txt3_en, '''''')
    END txt3
INTO _texts_execute
FROM tea.texts_title_ext_home dt
WHERE dt.home_work = _m1
  AND dt.territory_type = _t1
  AND dt.selected_territ = CASE 
    WHEN _t2 = 'LV'
      THEN 'all'
    ELSE 'selected'
    END;

--Vaicājuma konstruēšana.
_sql_main := CONCAT ('WITH m
AS (
  SELECT MAX("date") "date"
  FROM web.territories_lv
  WHERE "level" = ', _t1, '
  )
  ,mc
AS (
  SELECT MAX("date") "date"
  FROM web.territories_lv
  WHERE "level" = 4
  )
  ,d
AS (
  SELECT (
      SELECT value_ind
      FROM tea.data a
      WHERE a.year = ', _year, '
        AND a.code_h = ''', _code_h, '''
        AND a.code_w = ''', _code_w, '''
        AND a.value_code = ''', _value_code_empl, '''
        AND a.level_h = ''', _level_h, '''
        AND a.level_w = ''', _level_w, '''
        AND a.brdwn = ''', _brdwn, '''
      ) empl_count
    ,(
      SELECT COUNT(*)
      FROM web.territories_lv_3857 a
      INNER JOIN m ON a."date" = m."date"
      WHERE a."level" = ', _t1, '
      ) cnt_total
    ,(
      SELECT COUNT(*)
      FROM web.territories_lv_3857 a
      INNER JOIN m ON a."date" = m."date"
      WHERE a."level" = ', _t1, '
        AND a.name_lv NOT LIKE ''%novads%''
        AND a.name_lv NOT LIKE ''%pagasts%''
      ) cnt_type1
    ,(
      SELECT COUNT(*)
      FROM web.territories_lv_3857 a
      INNER JOIN m ON a."date" = m."date"
      WHERE a."level" = ', _t1, '
        AND (
          a.name_lv LIKE ''%novads%''
          OR a.name_lv LIKE ''%pagasts%''
          )
      ) cnt_type2
  )
  ,empl_count_c_w
AS (
  SELECT value_ind
  FROM tea.data a
  LEFT JOIN mc ON true
  LEFT JOIN tea.get_territory(', _year, ', ''', _t1, ''', ''', _t2, ''') t ON true
  LEFT JOIN web.territories_lv_3857 tc ON tc."date" = mc."date"
    AND t.name_lv = tc.name_lv
    AND tc."level" = 4
  WHERE a.year = ', _year, '
    AND a.code_h = ''total''
    AND a.code_w = tc.code
    AND a.value_code = ''', _value_code_empl, '''
    AND a.level_h = 99
    AND a.level_w = 4
    AND a.brdwn = ''', _brdwn, '''
  )
  ,empl_count_c_h
AS (
  SELECT value_ind
  FROM tea.data a
  LEFT JOIN mc ON true
  LEFT JOIN tea.get_territory(', _year, ', ''', _t1, ''', ''', _t2, ''') t ON true
  LEFT JOIN web.territories_lv_3857 tc ON tc."date" = mc."date"
    AND t.name_lv = tc.name_lv
    AND tc."level" = 4
  WHERE a.year = ', _year, '
    AND a.code_h = tc.code
    AND a.code_w = ''total''
    AND a.value_code = ''', _value_code_empl, '''
    AND a.level_h = 4
    AND a.level_w = 99
    AND a.brdwn = ''', _brdwn, '''
  )
SELECT json_build_object(
  ''map_territory_info'', json_build_object(
    ''title'', CONCAT (', _texts_execute.title, ')
    ,''data'', (
      SELECT json_agg(
        CASE 
          WHEN ', _t1, ' IN (
            3
            ,4
            )
            AND ''', _t2, ''' = ''LV''
            THEN json_build_array(
              json_build_object(
                ''variable'', ''cnt_total''
                ,''name'', CONCAT (', _texts_execute.txt1, ')
                ,''value'', CASE 
                  WHEN ''', _lang, ''' = ''lv''
                    THEN cnt_total
                  ELSE cnt_total
                  END
                )
              ,json_build_object(
                ''variable'', ''cnt_type1''
                ,''name'', CONCAT (', _texts_execute.txt2, ')
                ,''value'', CASE
                  WHEN ', _t1, ' = 3
                    THEN CASE 
                      WHEN ''', _lang, ''' = ''lv''
                        THEN cnt_type1 || CASE
                          WHEN RIGHT(cnt_type1::TEXT, 1) LIKE ''1''
                            AND RIGHT(cnt_type1::TEXT, 2) NOT LIKE ''11''
                            THEN '' valstspilsēta''
                          ELSE '' valstspilsētas''
                          END
                      ELSE cnt_type1 || '' cities''
                      END
                  ELSE CASE
                    WHEN ''', _lang, ''' = ''lv''
                      THEN cnt_type1 || CASE
                        WHEN RIGHT(cnt_type1::TEXT, 1) LIKE ''1''
                          AND RIGHT(cnt_type1::TEXT, 2) NOT LIKE ''11''
                          THEN '' pilsēta''
                        ELSE '' pilsētas''
                        END
                    ELSE cnt_type1 || '' cities and towns''
                    END
                  END
                )
              ,json_build_object(
                ''variable'', ''cnt_type2''
                ,''name'', CONCAT (', _texts_execute.txt3, ')
                ,''value'', CASE
                  WHEN ', _t1, ' = 3
                    THEN CASE 
                      WHEN ''', _lang, ''' = ''lv''
                        THEN cnt_type2 || CASE
                          WHEN RIGHT(cnt_type2::TEXT, 1) LIKE ''1''
                            AND RIGHT(cnt_type2::TEXT, 2) NOT LIKE ''11''
                            THEN '' novads''
                          ELSE '' novadi''
                          END
                      ELSE cnt_type2 || '' municipalities''
                      END
                  ELSE CASE
                    WHEN ''', _lang, ''' = ''lv''
                      THEN cnt_type2 || CASE
                        WHEN RIGHT(cnt_type2::TEXT, 1) LIKE ''1''
                          AND RIGHT(cnt_type2::TEXT, 2) NOT LIKE ''11''
                          THEN '' pagasts''
                        ELSE '' pagasti''
                        END
                    ELSE cnt_type2 || '' rural territories''
                    END
                  END)
              )
          WHEN (
            ', _t1, ' IN (
              3
              ,4
              )
            OR (
              ', _t1, ' = 7
              AND dc.includes_lv IS NULL
              AND dc.excludes_lv IS NULL
              )
            )
            AND ''', _t2, ''' != ''LV''
            AND empl_count IS NOT NULL
            THEN json_build_array(
              json_build_object(
                ''variable'', ''empl_count''
                ,''name'', CONCAT (', _texts_execute.txt1, ')
                ,''value'', CASE 
                  WHEN ''', _lang, ''' = ''lv''
                    THEN get_pretty_number(''lv'', empl_count)
                  ELSE get_pretty_number(''en'', empl_count)
                  END
                )
              )
          WHEN empl_count IS NOT NULL
            THEN json_build_array(
              json_build_object(
                ''variable'', ''desc''
                ,''name'', REPLACE(CONCAT (', _texts_execute.txt1, '), ''..'', ''.'')
                )
              )
          ELSE NULL
          END
        )
      FROM d
      )
    )
  ) r_t
FROM d
LEFT JOIN m ON true
LEFT JOIN empl_count_c_w ON true
LEFT JOIN empl_count_c_h ON true
LEFT JOIN tea.get_territory(''', _year, ''', ''', _t1, ''', ''', _t2, ''') t ON true
LEFT JOIN web.dpa_contents dc ON ''', _t2, ''' = dc.dpa_id
  AND dc."date" = m."date"');

RAISE NOTICE 'lang = %, year = %, _level_h = %, _code_h = %, _level_w = %, _code_w = %, _brdwn = %, _value_code = %'
  ,_lang
  ,_year
  ,_level_h
  ,_code_h
  ,_level_w
  ,_code_w
  ,_brdwn
  ,_value_code;

EXECUTE _sql_main
INTO _data_execute
USING _lang
  ,_year
  ,_level_h
  ,_code_h
  ,_level_w
  ,_code_w
  ,_brdwn
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
  ON FUNCTION tea.a_generate_map_territory_info_home(TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT)
  FROM public;
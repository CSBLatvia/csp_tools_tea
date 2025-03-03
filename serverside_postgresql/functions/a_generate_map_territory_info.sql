CREATE OR REPLACE FUNCTION tea.a_generate_map_territory_info(
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
_level_h_pop INT;
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

--Testēšanai.
--SELECT tea.a_generate_map_territory_info('lv', 2017, 'w', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_territory_info('lv', 2017, 'w', 'av', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_territory_info('lv', 2017, 'h', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_territory_info('lv', 2017, 'h', 'av', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_territory_info('lv', 2017, 'w', 'e', 's', 'none', 0, 'all');
--SELECT tea.a_generate_map_territory_info('lv', 2017, 'w', 'av', 's', 'none', 0, 'all');
--SELECT tea.a_generate_map_territory_info('lv', 2017, 'h', 'e', 's', 'none', 0, 'all');
--SELECT tea.a_generate_map_territory_info('lv', 2017, 'h', 'av', 's', 'none', 0, 'all');
--SELECT tea.a_generate_map_territory_info('en', 2017, 'w', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_territory_info('en', 2017, 'w', 'av', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_territory_info('en', 2017, 'h', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_territory_info('en', 2017, 'h', 'av', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_territory_info('en', 2017, 'w', 'e', 's', 'none', 0, 'all');
--SELECT tea.a_generate_map_territory_info('en', 2017, 'w', 'av', 's', 'none', 0, 'all');
--SELECT tea.a_generate_map_territory_info('en', 2017, 'h', 'e', 's', 'none', 0, 'all');
--SELECT tea.a_generate_map_territory_info('en', 2017, 'h', 'av', 's', 'none', 0, 'all');

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

CASE
  WHEN _m1 = 'w'
    AND _t2 = 'LV'
    THEN _level_h_pop := 0;
  WHEN _m1 = 'h'
    AND _t2 = 'LV'
    THEN _level_h_pop := 0;
  WHEN _m1 = 'w'
    AND _t2 != 'LV'
    THEN _level_h_pop := _t1;
  WHEN _m1 = 'h'
    AND _t2 != 'LV'
    THEN _level_h_pop := _t1;
  ELSE
  END CASE;

--Teksti.
SELECT CASE 
    WHEN _lang = 'lv'
      THEN ext_map_territory_info_title_lv
    ELSE ext_map_territory_info_title_en
    END title
,CASE 
    WHEN _lang = 'lv'
      THEN ext_map_territory_info_txt1_lv
    ELSE ext_map_territory_info_txt1_en
    END txt1
,CASE 
    WHEN _lang = 'lv'
      THEN ext_map_territory_info_txt2_lv
    ELSE ext_map_territory_info_txt2_en
    END txt2
,CASE 
    WHEN _lang = 'lv'
      THEN COALESCE (ext_map_territory_info_txt3_lv, '''''')
    ELSE COALESCE (ext_map_territory_info_txt3_en, '''''')
    END txt3
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
_sql_main := CONCAT ('WITH d
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
      SELECT value_ind
      FROM tea.data b
      WHERE b.year = ', _year, '
        AND b.code_h = ''', _code_h, '''
        AND b.code_w = ''', _code_w, '''
        AND b.value_code = ''', _value_code, '''
        AND b.level_h = ''', _level_h, '''
        AND b.level_w = ''', _level_w, '''
        AND b.brdwn = ''', _brdwn, '''
      ) value_sum
    ,(
      SELECT value_ind
      FROM tea.data c
      WHERE c.year = ', _year, '
        AND c.level_h = ''', _level_h_pop, '''
        AND c.code_h = ''', _t2, '''
        AND c.brdwn_code = ''y15y64''
        AND c.brdwn = ''pop''
      ) y15y64
  )
SELECT json_build_object(
  ''map_territory_info'', json_build_object(
    ''title'', CONCAT (', _texts_execute.title, '),
    ''data'', (
      SELECT json_agg(
        CASE 
          WHEN ''', _m2, ''' = ''e''
            THEN (jsonb_build_array(
              CASE
                WHEN y15y64 IS NOT NULL
                  THEN jsonb_build_object(
                    ''variable'', ''y15y64''
                    ,''name'', CONCAT (', _texts_execute.txt1, ')
                    ,''value'', CASE 
                      WHEN ''', _lang, ''' = ''lv''
                        THEN get_pretty_number(''lv'', y15y64)
                      ELSE get_pretty_number(''en'', y15y64)
                      END
                    )
                ELSE ''"null"''
                END
              ,CASE
                WHEN empl_count IS NOT NULL
                  THEN jsonb_build_object(
                  ''variable'', ''empl_count''
                  ,''name'', CONCAT (', _texts_execute.txt2, ')
                  ,''value'', CASE 
                    WHEN ''', _lang, ''' = ''lv''
                      THEN get_pretty_number(''lv'', empl_count)
                    ELSE get_pretty_number(''en'', empl_count)
                    END
                  )
                ELSE ''"null"''
                END
              ,CASE
                WHEN empl_count IS NOT NULL
                  THEN jsonb_build_object(
                  ''variable'', ''empl_level''
                  ,''name'', CONCAT (', _texts_execute.txt3, ')
                  ,''value'', CASE
                    WHEN ''', _m1, ''' = ''w''
                      THEN CASE 
                        WHEN ''', _lang, ''' = ''lv''
                          THEN get_pretty_number(''lv'', empl_count / NULLIF(y15y64, 0) * 100) || '' '' || LOWER(m_v_c.name_lv)
                        ELSE get_pretty_number(''en'', empl_count / NULLIF(y15y64, 0) * 100) || '' '' || LOWER(m_v_c.name_en)
                        END
                    ELSE CASE
                      WHEN ''', _lang, ''' = ''lv''
                        THEN get_pretty_number(''lv'', empl_count / NULLIF(y15y64, 0) * 100) || ''%''
                      ELSE get_pretty_number(''en'', empl_count / NULLIF(y15y64, 0) * 100) || ''%''
                      END
                    END
                  )
                ELSE ''"null"''
                END
              ) - ''null'')::JSON
          ELSE
            CASE
              WHEN value_sum IS NOT NULL
                THEN json_build_array(
                  json_build_object(
                    ''variable'', ''value_sum''
                    ,''name'', CONCAT (', _texts_execute.txt1, ')
                    ,''value'', CASE 
                      WHEN ''', _lang, ''' = ''lv''
                        THEN get_pretty_number(''lv'', value_sum) || '' €''
                      ELSE ''€ '' || get_pretty_number(''en'', value_sum)
                      END
                    )
                  ,json_build_object(
                    ''variable'', ''per_empl''
                    ,''name'', CONCAT (', _texts_execute.txt2, ')
                    ,''value'', CASE 
                      WHEN ''', _lang, ''' = ''lv''
                        THEN get_pretty_number(''lv'', value_sum / NULLIF(empl_count, 0)) || '' €''
                      ELSE ''€ '' || get_pretty_number(''en'', value_sum / NULLIF(empl_count, 0))
                      END
                    )
                  )
              ELSE NULL
              END
          END
        )
      FROM d
      )
    )
  ) r_t
FROM d
LEFT JOIN tea.get_territory(''', _year, ''', ''', _t1, ''', ''', _t2, ''') t ON true
LEFT JOIN tea.meta_value_code m_v_c ON m_v_c.value_code = ''', _value_code, '''
--LEFT JOIN tea.meta_brdwn_code m_b_c ON m_b_c.brdwn_code = d.brdwn_code
;');

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
  ON FUNCTION tea.a_generate_map_territory_info(TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT)
  FROM public;
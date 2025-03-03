CREATE OR REPLACE FUNCTION tea.generate_text_pop(
  _lang text,
  _reference_period integer,
  _home_work text,
  _indicator_type text,
  _territ_level integer,
  _selected_territ text,
  _indicator_selected text,
  _breakdown_selected text,
  _request_type text,
  _over_territory text)
    RETURNS TABLE(r_t text, deb_par text, deb_sql text, deb_r_id integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

DECLARE _params_all_text_string TEXT;
_return_text_string TEXT;
_data_execute RECORD;
_data_execute_result RECORD;
_sql_string TEXT;
_territ_level_code INT;
_level_h INT;
_level_w INT;
_code_h TEXT;
_code_w TEXT;
_brdwn TEXT;
_brdwn_code TEXT;
_value_code TEXT;
_error_msg TEXT;
_sql_main TEXT;
_sql_text TEXT;
_sql_ter TEXT;
_sql_ter_total TEXT;
_sql_rel TEXT;
_sql_expl TEXT;
_error_detail TEXT;
_error_hint TEXT;
_r_id INT;

--Testēšanai.
--SELECT tea.generate_text_pop('lv', 2017, 'w', 'e', 3, 'LV0023000', 's', 'none', 'over', 'LV0001000');
--SELECT tea.generate_text_pop('lv', 2017, 'w', 'av', 3, 'LV0023000', 's', 'none', 'over', 'LV0001000');
--SELECT tea.generate_text_pop('lv', 2017, 'h', 'e', 3, 'LV0023000', 's', 'none', 'over', 'LV0001000');
--SELECT tea.generate_text_pop('lv', 2017, 'h', 'av', 3, 'LV0023000', 's', 'none', 'over', 'LV0001000');
--SELECT tea.generate_text_pop('lv', 2017, 'w', 'e', 3, 'all', 's', 'none', 'over', 'LV0001000');
--SELECT tea.generate_text_pop('lv', 2017, 'w', 'av', 3, 'all', 's', 'none', 'over', 'LV0001000');
--SELECT tea.generate_text_pop('lv', 2017, 'h', 'e', 3, 'all', 's', 'none', 'over', 'LV0001000');
--SELECT tea.generate_text_pop('lv', 2017, 'h', 'av', 3, 'all', 's', 'none', 'over', 'LV0001000');
--SELECT tea.generate_text_pop('en', 2017, 'w', 'e', 3, 'LV0023000', 's', 'none', 'over', 'LV0001000');
--SELECT tea.generate_text_pop('lv', 2017, 'w', 'e', 3, 'LV0023000', 'i', 'none', 'over', 'LV0001000');
--SELECT tea.generate_text_pop('lv', 2017, 'w', 'e', 3, 'LV0023000', 'i', 'A', 'over', 'LV0001000');
--SELECT tea.generate_text_pop('lv', 2017, 'w', 'e', 3, 'LV0023000', 's', 'none', 'selected_out', 'parent-LV0001000');
--SELECT tea.generate_text_pop('lv', 2017, 'w', 'e', 3, 'LV0023000', 's', 'none', 'selected_in', 'LV0001000');

BEGIN

--Parametru pārveide, lai atbilstu datubāzē izmantotajiem.
---Identificē izvēlētās teritorijas iekšējo/ārējo apli.
CASE
  WHEN _selected_territ = _over_territory
    THEN _request_type := 'selected_in';
  WHEN LEFT(_over_territory, 6) = 'parent'
    THEN _request_type := 'selected_out';
  ELSE
  END CASE;

_params_all_text_string := CONCAT (
  _lang,
  ', ', _reference_period,
  ', ', _home_work,
  ', ', _indicator_type,
  ', ', _territ_level,
  ', ', _selected_territ,
  ', ', _indicator_selected,
  ', ', _breakdown_selected,
  ', ', _request_type,
  ', ', _over_territory
  );

_brdwn_code := _breakdown_selected;
_territ_level_code := _territ_level::INT;

---Panelim visas latvijas gadījumā samaina uz valsts kodu.
IF _selected_territ = 'all'
  AND _request_type = 'panel'
  THEN _selected_territ := 'LV';
    _territ_level := 0;
END IF;

---Nosaka, ja virs izvēlnē izvēlētās teritorijas.
SELECT p_id
  ,home_work
  ,indicator_type
  ,selected_territ
  ,breakdown_selected
  ,request_type
  ,sql_string_from_join
  ,CASE 
    WHEN _lang = 'lv'
      THEN text_display_lv
    ELSE text_display_en
    END text_display
  ,sql_string_where
FROM tea.texts_pop dt
INTO _data_execute
WHERE dt.home_work = _home_work
  AND dt.indicator_type = CASE 
    WHEN _indicator_type = 'e'
      THEN 'empl'
    ELSE 'other'
    END
  AND dt.selected_territ = CASE 
    WHEN _selected_territ = 'all'
      THEN 'all'
    ELSE 'selected'
    END
  AND dt.indicator_selected = CASE 
    WHEN _indicator_selected = 'none'
      THEN 'none'
    ELSE 'selected'
    END
  AND dt.breakdown_selected = CASE 
    WHEN _breakdown_selected = 'none'
      THEN 'none'
    ELSE 'selected'
    END
  AND dt.request_type = _request_type LIMIT 1;

IF _data_execute IS NULL
  THEN _return_text_string := CONCAT (
    _params_all_text_string
    , '<br>Nav atbilstoša ieraksta tekstu tabulā!'
    );

    RETURN query
    SELECT _return_text_string r_t
      ,_params_all_text_string deb_par
      ,NULL deb_sql
      ,0 deb_r_id;

ELSE
  CASE
    WHEN _indicator_type = 'av'
      THEN _value_code := 'value_added';
    WHEN _indicator_type = 'e'
      THEN
        IF _home_work = 'w'
          THEN _value_code := 'empl_w';
        ELSE _value_code := 'empl';
        END IF;
    WHEN _indicator_type = 'vp'
      THEN _value_code := 'value_prod';
    ELSE _error_msg := CONCAT (
      _error_msg
      , '_indicator_type vērtības neeksistējošas.'
      );
    END CASE;

  CASE
    WHEN _indicator_selected = 'i'
      THEN _brdwn := 'nace';
    WHEN _indicator_selected = 'p'
      THEN _brdwn := 'prof';
    WHEN _indicator_selected = 's'
      THEN _brdwn := 'sector';
    ELSE _error_msg := CONCAT (
      _error_msg
      , '_indicator_selected vērtības neeksistējošas.'
      );
    END CASE;

  --Izveido debug tekstu.
  _params_all_text_string := CONCAT (
    'home_work = ', _home_work, '
    ,indicator_type = ', CASE
      WHEN _indicator_type = 'e'
        THEN 'empl'
      ELSE 'other'
      END, '
    ,selected_territ = ', CASE
      WHEN _selected_territ = 'all'
        THEN 'all'
      ELSE 'selected'
      END, '
    ,indicator_selected = ', CASE
      WHEN _indicator_selected = 'none'
        THEN 'none'
      ELSE 'selected'
      END, '
    ,breakdown_selected = ', CASE
      WHEN _breakdown_selected = 'none'
        THEN 'none'
      ELSE 'selected'
      END, '
    ,', _params_all_text_string);

  --Saliek home work vērtības atkarībā no selected_territ veida.
  IF _selected_territ = 'LV'
    AND _request_type = 'panel'
    THEN
  ---Panelim visas latvijas gadījumā samaina uz valsts kodu.
    CASE
      WHEN (_home_work = 'w'
        AND _request_type = 'panel')
        THEN _level_w := 0;
          _code_w := 'LV';
          _level_h := 99;
          _code_h := 'total';
      WHEN (_home_work = 'h'
        AND _request_type = 'panel')
        THEN _level_h := 0;
          _code_h := 'LV';
          _level_w := 99;
          _code_w := 'total';
      ELSE
      END CASE;
    ELSE
    CASE
      WHEN (_home_work = 'w'
        AND _selected_territ = 'all')
        THEN _level_w := _territ_level_code;
          _code_w := _over_territory;
          _level_h := 99;
          _code_h := 'total';
      WHEN (_home_work = 'w'
        AND _selected_territ != 'all')
        THEN
        IF _request_type = 'panel'
          THEN _level_h := 99;
            _code_h := 'total';
        ELSE _level_h := _territ_level_code;
          _code_h := _over_territory;
        END IF;
        _level_w := _territ_level_code;
        _code_w := _selected_territ;
      WHEN _home_work = 'h'
        AND _selected_territ = 'all'
        THEN _level_h := _territ_level_code;
          _code_h := _over_territory;
          _level_w := 99;
          _code_w := 'total';
      WHEN _home_work = 'h'
        AND _selected_territ != 'all'
        THEN _level_h := _territ_level_code;
          _code_h := _selected_territ;
          IF _request_type = 'panel'
            THEN _level_w := 99;
              _code_w := 'total';
          ELSE _level_w := _territ_level_code;
            _code_w := _over_territory;
          END IF;
      ELSE
      END CASE;
  END IF;

  --Izvēlēta teritorija, ārējais/iekšējais aplis.
  ---Izdalīts atkarībā no tā, vai ir norādīts "indicator_selected". Ja ir, "out" vietā "total", jo ārējā aplī ir kopējais skaits.
  CASE
    WHEN _request_type = 'selected_out'
      AND _home_work = 'h'
      AND _indicator_selected = 'none'
      THEN _level_w := 99;
        _code_w := 'out';
    WHEN _request_type = 'selected_out'
      AND _home_work = 'w'
      AND _indicator_selected = 'none'
      THEN _level_h := 99;
        _code_h := 'out';
    WHEN _request_type = 'selected_out'
      AND _home_work = 'h'
      AND _indicator_selected != 'none'
      THEN _level_w := 99;
        _code_w := 'total';
    WHEN _request_type = 'selected_out'
      AND _home_work = 'w'
      AND _indicator_selected != 'none'
      THEN _level_h := 99;
        _code_h := 'total';
    ELSE
    END CASE;

  IF _indicator_selected = 'none'
    THEN _brdwn_code := 'total';
      _brdwn := 'total';
  END IF;

  --Vaicājuma konstruēšana.
  _sql_main := CONCAT ('
FROM (
  SELECT DISTINCT ON (dt.code_', _home_work, ') ''', _home_work, ''' hw
    ,id
    ,year
    ,level_h
    ,code_h
    ,level_w
    ,code_w
    ,brdwn
    ,brdwn_code
    ,value_code
    ,value_ind
  FROM tea.data dt
  WHERE dt.year = ', _reference_period, '
    AND dt.level_h = ', _level_h, '
    AND dt.code_h = ''', _code_h, '''
    AND dt.brdwn = ''', _brdwn, '''');

  ---Top/izvēlēta vērtība/nav izvēlēts papildus dalījums.
  IF _brdwn_code = 'none'
    AND _indicator_selected != 'none'
    THEN _sql_main := CONCAT (
      _sql_main
      ,'
    AND dt.brdwn_code != ''total'''
      );
    ELSE _sql_main := CONCAT (
      _sql_main
      ,'
    AND dt.brdwn_code = ''', _brdwn_code, ''''
      );
  END IF;

  _sql_main := CONCAT (
    _sql_main
    ,'
    AND dt.value_code = ''', _value_code, '''
    AND dt.level_w = ''', _level_w, '''
    AND dt.code_w = ''', _code_w, '''
  ORDER BY dt.code_', _home_work, '
    ,dt.value_ind DESC NULLS LAST
  ) main'
    );

  --Pieliek teritoriju un nozaru/profesiju/sektoru tekstu.
  _sql_expl := '
LEFT JOIN tea.get_territory(main.year, main.level_h, main.code_h) t_h ON true
LEFT JOIN tea.get_territory(main.year, main.level_w, main.code_w) t_w ON true
LEFT JOIN tea.meta_brdwn m_b ON main.brdwn = m_b.brdwn
LEFT JOIN tea.meta_brdwn_code m_b_c ON main.brdwn = m_b_c.brdwn
  AND main.brdwn_code = m_b_c.brdwn_code
LEFT JOIN tea.meta_value_code m_v_c ON main.value_code = m_v_c.value_code';

  --Pieliek tabulu īpatsvaram teritorijā.
  _sql_ter := '
LEFT JOIN tea.data ter ON main.year = ter.year
  AND main.level_h = ter.level_h
  AND main.code_h = ter.code_h
  AND main.level_w = ter.level_w
  AND main.code_w = ter.code_w
  AND main.value_code = ter.value_code
  AND main.brdwn = ter.brdwn
  AND ter.brdwn_code = ''total''';

  --Pieliek iedzīvotāju skaitu.
  IF (_indicator_selected = 'none'
    AND _request_type = 'over'
    AND _indicator_type = 'e'
    AND _selected_territ = 'all')
    OR _request_type = 'panel'
    THEN _sql_ter := CONCAT (
      _sql_ter
      ,'
LEFT JOIN tea.data pop_wa ON main.year = pop_wa.year
  AND pop_wa.level_w = 99
  AND pop_wa.code_w = ''total''
  AND pop_wa.value_code = ''persons''
  AND pop_wa.brdwn = ''pop''
  AND pop_wa.brdwn_code = ''y15y64''
  AND (
    (
      main.level_h = pop_wa.level_h
      AND main.code_h = pop_wa.code_h
      )
    OR (
      main.level_w = pop_wa.level_h
      AND main.code_w = pop_wa.code_h
      )
    )'
      );
  END IF;

  --Izvēlēta teritorija.
  IF
    LEFT(_request_type, 8) = 'selected'
      OR _breakdown_selected = 'none'
      THEN _sql_ter_total := CONCAT (
        _sql_ter_total
        ,'
CROSS JOIN (
  SELECT DISTINCT ON (dt.code_', _home_work, ') ''', _home_work, ''' hw
    ,id
    ,year
    ,level_h
    ,code_h
    ,level_w
    ,code_w
    ,brdwn
    ,brdwn_code
    ,value_code
    ,value_ind
  FROM tea.data dt
  WHERE dt.year = ', _reference_period
        );

        CASE
          WHEN _home_work = 'h'
          THEN _sql_ter := CONCAT (
            _sql_ter
            ,'
LEFT JOIN tea.data ter_sel ON main.year = ter_sel.year
  AND main.level_h = ter_sel.level_h
  AND main.code_h = ter_sel.code_h
  AND ter_sel.level_w = 99
  AND ter_sel.code_w = ''total''
  AND main.value_code = ter_sel.value_code
  AND main.brdwn = ter_sel.brdwn
  AND ter_sel.brdwn_code = ''total'''
            );

            _sql_ter_total := CONCAT (
              _sql_ter_total
              ,'
    AND dt.level_h = ', _level_h, '
    AND dt.code_h = ''', _code_h, '''
    AND dt.level_w = 99
    AND dt.code_w = ''total'''
              );

          WHEN _home_work = 'w'
            THEN _sql_ter := CONCAT (
              _sql_ter
              ,'
LEFT JOIN tea.data ter_sel ON main.year = ter_sel.year
  AND ter_sel.level_h = 99
  AND ter_sel.code_h = ''total''
  AND main.level_w = ter_sel.level_w
  AND main.code_w = ter_sel.code_w
  AND main.value_code = ter_sel.value_code
  AND main.brdwn = ter_sel.brdwn
  AND ter_sel.brdwn_code = ''total'''
            );

            _sql_ter := CONCAT (
              _sql_ter
              ,'
LEFT JOIN tea.data t_ter_sel ON main.year = t_ter_sel.year
  AND t_ter_sel.level_w = 99
  AND t_ter_sel.code_w = ''total''
  AND main.level_h = t_ter_sel.level_h
  AND main.code_h = t_ter_sel.code_h
  AND main.value_code = t_ter_sel.value_code
  AND main.brdwn = t_ter_sel.brdwn
  AND t_ter_sel.brdwn_code = ''total'''
              );

            _sql_ter_total := CONCAT (
              _sql_ter_total
              ,'
    AND dt.level_h = 99
    AND dt.code_h = ''total''
    AND dt.level_w = ', _level_w, '
    AND dt.code_w = ''', _code_w, '''
    AND dt.brdwn = ''', _brdwn, ''''
              );

          ELSE
          END CASE;

        _sql_ter_total := CONCAT (
          _sql_ter_total
          ,'
    AND dt.brdwn = ''', _brdwn, ''''
          );

        ---Top/izvēlēta vērtība.
        IF _brdwn_code = 'none'
          THEN _sql_ter_total := CONCAT (
            _sql_ter_total
            ,'
    AND dt.brdwn_code != ''total'''
            );
        ELSE
          _sql_ter_total := CONCAT (
            _sql_ter_total
            ,'
    AND dt.brdwn_code = ''', _brdwn_code, ''''
            );
        END IF;

        _sql_ter_total := CONCAT (
          _sql_ter_total
          ,'
    AND dt.value_code = ''', _value_code, '''
  ORDER BY dt.code_', _home_work, '
    ,dt.value_ind DESC NULLS LAST
  ) tt_top'
          );

        _sql_ter_total := CONCAT (
          _sql_ter_total
          ,'
LEFT JOIN tea.meta_brdwn_code tt_m_b_c ON tt_top.brdwn = tt_m_b_c.brdwn
  AND tt_top.brdwn_code = tt_m_b_c.brdwn_code
LEFT JOIN tea.data tt_rel ON tt_top.year = tt_rel.year
  AND tt_top.level_h = tt_rel.level_h
  AND tt_top.code_h = tt_rel.code_h
  AND tt_top.level_w = tt_rel.level_w
  AND tt_top.code_w = tt_rel.code_w
  AND tt_rel.value_code = ''empl''
  AND tt_top.brdwn = tt_rel.brdwn
  AND tt_top.brdwn_code = tt_rel.brdwn_code
LEFT JOIN tea.data tt_rel_w ON tt_top.year = tt_rel_w.year
  AND tt_top.level_h = tt_rel_w.level_h
  AND tt_top.code_h = tt_rel_w.code_h
  AND tt_top.level_w = tt_rel_w.level_w
  AND tt_top.code_w = tt_rel_w.code_w
  AND tt_rel_w.value_code = ''empl_w''
  AND tt_top.brdwn = tt_rel_w.brdwn
  AND tt_top.brdwn_code = tt_rel_w.brdwn_code'
          );

END IF;

--Pieliek relatīvo rādītāju (dala ar main rādītāju).
_sql_rel := '
LEFT JOIN tea.data rel ON main.year = rel.year
  AND main.level_h = rel.level_h
  AND main.code_h = rel.code_h
  AND main.level_w = rel.level_w
  AND main.code_w = rel.code_w
  AND rel.value_code = ''empl''
  AND main.brdwn = rel.brdwn
  AND main.brdwn_code = rel.brdwn_code
LEFT JOIN tea.data rel_w ON main.year = rel_w.year
  AND main.level_h = rel_w.level_h
  AND main.code_h = rel_w.code_h
  AND main.level_w = rel_w.level_w
  AND main.code_w = rel_w.code_w
  AND rel_w.value_code = ''empl_w''
  AND main.brdwn = rel_w.brdwn
  AND main.brdwn_code = rel_w.brdwn_code';

_sql_text := CONCAT (
  'SELECT CONCAT (
    ', _data_execute.text_display, '
    ) r_t'
  );

_sql_string := CONCAT (
  _sql_text
  ,_sql_main
  ,_sql_ter
  ,_sql_ter_total
  ,_sql_rel
  ,_sql_expl
  );

_r_id := _data_execute.p_id;

EXECUTE _sql_string
INTO _data_execute
/*USING _reference_period
  ,_territ_level_code
  ,_over_territory
  ,_selected_territ*/;

RETURN query
SELECT _data_execute.r_t r_t
  ,_params_all_text_string deb_par
  ,_sql_string deb_sql
  ,_r_id deb_r_id;

END IF;

EXCEPTION
  WHEN OTHERS
    THEN GET STACKED DIAGNOSTICS _error_msg  = MESSAGE_TEXT
      ,_error_detail = PG_EXCEPTION_CONTEXT
      ,_error_hint = PG_EXCEPTION_DETAIL;

RETURN query
SELECT 'Something went wrong' r_t
  ,_params_all_text_string deb_par
  ,_sql_string deb_sql
  ,_r_id deb_r_id;

END;
$BODY$;

REVOKE ALL
  ON FUNCTION tea.generate_text_pop(TEXT, INTEGER, TEXT, TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT)
  FROM public;
CREATE OR REPLACE FUNCTION tea.generate_text_title(
  _variables_in json,
  _lang text,
  _reference_period integer,
  _home_work text,
  _indicator_type text,
  _territ_level integer,
  _selected_territ text,
  _indicator_selected text,
  _breakdown_selected text)
    RETURNS TABLE(r_t json) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

DECLARE _params_all_text_string TEXT;
_return_text_string TEXT;
_data_execute RECORD;
_data_execute_2 RECORD;
_sql_string TEXT;
_territ_level_code INT;
_level INT;
_code TEXT;
_brdwn TEXT;
_brdwn_code TEXT;
_value_code TEXT;
_error_msg TEXT;
_sql_main TEXT;
_r_id INT;

BEGIN

--Parametru pārveide, lai atbilstu datubāzē izmantotajiem.
_brdwn_code := _breakdown_selected;
_territ_level_code := _territ_level::INT;

IF _selected_territ = 'all'
  THEN _selected_territ := 'LV';
    _territ_level := 0;
END IF;

CASE
  WHEN _indicator_selected = 'i'
    THEN _brdwn := 'nace';
  WHEN _indicator_selected = 'p'
    THEN _brdwn := 'prof';
  WHEN _indicator_selected = 's'
    THEN _brdwn := 'sector';
  ELSE _brdwn := 'none';
    _error_msg := CONCAT (
      _error_msg
      ,'_indicator_selected vērtības neeksistējošas.'
      );
  END CASE;

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
    ,'_indicator_type vērtības neeksistējošas.'
    );
  END CASE;

SELECT string_agg (
  'COALESCE (
    tea.generate_text_title_sub (
      '|| value || '_' || _lang || '
      ,' || _reference_period || '
      ,' || '''' || _value_code || '''
      ,' || _territ_level || '
      ,' || '''' || _selected_territ || '''
      ,' || '''' || _brdwn || '''
      ,' || '''' || _breakdown_selected ||'''
      )
    , ' || '''' || value || ' not defined ''
    ) ' || value
  ,', '
  ) sql_variables
INTO _data_execute
FROM json_array_elements_text(_variables_in);

--Vaicājuma konstruēšana.
_sql_main := CONCAT ('SELECT row_to_json(t) r_t
FROM (
  SELECT r_id
    ,', _data_execute.sql_variables, '
  FROM tea.texts_title dt
  WHERE dt.home_work = ''', _home_work, '''
    AND dt.indicator_type = CASE 
      WHEN ''', _indicator_type, ''' = ''e''
        THEN ''empl''
      ELSE ''other''
      END
    AND dt.selected_territ = CASE 
      WHEN ''', _selected_territ, ''' = ''LV''
        THEN ''all''
      ELSE ''selected''
      END
    AND dt.indicator_selected = CASE 
      WHEN ''', _indicator_selected, ''' = ''none''
        THEN ''none''
      ELSE ''selected''
      END
    AND dt.breakdown_selected = CASE 
      WHEN ''', _breakdown_selected, ''' = ''none''
        THEN ''none''
      ELSE ''selected''
      END LIMIT 1
  ) t');

RAISE NOTICE '%'
  ,_sql_main;

EXECUTE _sql_main
INTO _data_execute;

RETURN query
SELECT _data_execute.r_t r_t;

END; 
$BODY$;

REVOKE ALL
  ON FUNCTION tea.generate_text_title(json, TEXT, INTEGER, TEXT, TEXT, INTEGER, TEXT, TEXT, TEXT)
  FROM public;
CREATE OR REPLACE FUNCTION tea.generate_text_title_sub(
  _title text,
  _year integer,
  _value_code text,
  _territ_level integer,
  _selected_territ text,
  _brdwn text,
  _breakdown_selected text)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    STABLE PARALLEL UNSAFE

AS $BODY$

DECLARE _return_text record;
_sql_string TEXT;

BEGIN

IF char_length(_title) > 2
  THEN _sql_string := CONCAT ('SELECT CONCAT (', _title, ') r_t
FROM (VALUES (', _year, ')) s(year)
LEFT JOIN tea.meta_brdwn m_b ON m_b.brdwn = ''', _brdwn, '''
LEFT JOIN tea.meta_brdwn_code m_b_c ON m_b_c.brdwn = ''', _brdwn, '''
  AND m_b_c.brdwn_code = ''', _breakdown_selected, '''
LEFT JOIN tea.meta_value_code m_v_c ON m_v_c.value_code = ''', _value_code, '''
LEFT JOIN tea.get_territory(', _year, ', ', _territ_level, ', ', '''', _selected_territ, ''') t ON true');

    EXECUTE _sql_string
    INTO _return_text;

    RETURN _return_text.r_t;
ELSE
  RETURN NULL;
END IF;

END;
$BODY$;

REVOKE ALL
  ON FUNCTION tea.generate_text_title_sub(TEXT, INTEGER, TEXT, INTEGER, TEXT, TEXT, TEXT)
  FROM public;
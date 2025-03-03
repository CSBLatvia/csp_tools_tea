CREATE OR REPLACE FUNCTION tea.generate_text_menu(
  _indicator_selected text)
    RETURNS TABLE(r_t json, debug json) 
    LANGUAGE 'plpgsql'
    COST 100
    STABLE PARALLEL UNSAFE
    ROWS 1

AS $BODY$

BEGIN

RETURN query
SELECT json_object_agg(brdwn_code, json_build_array(name_lv, name_en)) r_t
  ,'null'::JSON debug
FROM tea.meta_brdwn_code
WHERE brdwn_code != 'other'
  AND brdwn = $1;

END;
$BODY$;

REVOKE ALL
  ON FUNCTION tea.generate_text_menu(TEXT)
  FROM public;
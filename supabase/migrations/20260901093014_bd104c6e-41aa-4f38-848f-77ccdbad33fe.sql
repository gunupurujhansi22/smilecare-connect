REVOKE ALL ON FUNCTION public.current_doctor_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_doctor_id() TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.next_prescription_number() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.next_prescription_number() TO authenticated, service_role;
-- DOCTORS
CREATE TABLE public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  qualification text NOT NULL DEFAULT '',
  specialization text NOT NULL DEFAULT '',
  experience_years integer NOT NULL DEFAULT 0,
  registration_number text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  profile_image text,
  bio text NOT NULL DEFAULT '',
  availability text NOT NULL DEFAULT 'Mon - Sat',
  working_hours text NOT NULL DEFAULT '9:00 AM - 7:00 PM',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.doctors TO anon;
GRANT SELECT, UPDATE ON public.doctors TO authenticated;
GRANT ALL ON public.doctors TO service_role;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.current_doctor_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.doctors WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')) LIMIT 1;
$$;

CREATE POLICY "Doctor profiles are public" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Doctors can update own profile" ON public.doctors FOR UPDATE TO authenticated
  USING (id = public.current_doctor_id()) WITH CHECK (id = public.current_doctor_id());

-- PATIENTS
CREATE TABLE public.patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  age integer,
  gender text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.patients TO authenticated;
GRANT ALL ON public.patients TO service_role;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- APPOINTMENTS
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_number text NOT NULL UNIQUE,
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  service text NOT NULL DEFAULT 'General Consultation',
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  appointment_type text NOT NULL DEFAULT 'New Consultation',
  reason text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Waiting',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors read own appointments" ON public.appointments FOR SELECT TO authenticated
  USING (doctor_id = public.current_doctor_id());
CREATE POLICY "Doctors update own appointments" ON public.appointments FOR UPDATE TO authenticated
  USING (doctor_id = public.current_doctor_id()) WITH CHECK (doctor_id = public.current_doctor_id());

CREATE POLICY "Doctors read own patients" ON public.patients FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments a WHERE a.patient_id = patients.id AND a.doctor_id = public.current_doctor_id()));

-- CLINICAL REFERENCE DATA
CREATE TABLE public.problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT ''
);
GRANT SELECT ON public.problems TO anon, authenticated;
GRANT ALL ON public.problems TO service_role;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Problems readable" ON public.problems FOR SELECT USING (true);

CREATE TABLE public.medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  generic_name text NOT NULL DEFAULT '',
  strength text NOT NULL DEFAULT '',
  form text NOT NULL DEFAULT 'Tablet',
  default_dosage text NOT NULL DEFAULT '1 tablet',
  default_frequency text NOT NULL DEFAULT 'Twice daily',
  default_duration text NOT NULL DEFAULT '3 days',
  instructions text NOT NULL DEFAULT 'Take after food.',
  status text NOT NULL DEFAULT 'active'
);
GRANT SELECT ON public.medicines TO anon, authenticated;
GRANT ALL ON public.medicines TO service_role;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Medicines readable" ON public.medicines FOR SELECT USING (true);

CREATE TABLE public.problem_medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id uuid NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  medicine_id uuid NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
  UNIQUE (problem_id, medicine_id)
);
GRANT SELECT ON public.problem_medicines TO anon, authenticated;
GRANT ALL ON public.problem_medicines TO service_role;
ALTER TABLE public.problem_medicines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mappings readable" ON public.problem_medicines FOR SELECT USING (true);

-- CONSULTATIONS
CREATE TABLE public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  problem text NOT NULL DEFAULT '',
  symptoms text NOT NULL DEFAULT '',
  clinical_observation text NOT NULL DEFAULT '',
  pain_level integer,
  affected_area text NOT NULL DEFAULT '',
  tooth_number text NOT NULL DEFAULT '',
  doctor_notes text NOT NULL DEFAULT '',
  diagnosis text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.consultations TO authenticated;
GRANT ALL ON public.consultations TO service_role;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors read own consultations" ON public.consultations FOR SELECT TO authenticated
  USING (doctor_id = public.current_doctor_id());
CREATE POLICY "Doctors create own consultations" ON public.consultations FOR INSERT TO authenticated
  WITH CHECK (doctor_id = public.current_doctor_id());
CREATE POLICY "Doctors update own consultations" ON public.consultations FOR UPDATE TO authenticated
  USING (doctor_id = public.current_doctor_id()) WITH CHECK (doctor_id = public.current_doctor_id());

-- PRESCRIPTIONS
CREATE TABLE public.prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_number text NOT NULL UNIQUE,
  consultation_id uuid NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  appointment_id uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Issued',
  follow_up_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.prescriptions TO authenticated;
GRANT ALL ON public.prescriptions TO service_role;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors read own prescriptions" ON public.prescriptions FOR SELECT TO authenticated
  USING (doctor_id = public.current_doctor_id());
CREATE POLICY "Doctors create own prescriptions" ON public.prescriptions FOR INSERT TO authenticated
  WITH CHECK (doctor_id = public.current_doctor_id());
CREATE POLICY "Doctors update own prescriptions" ON public.prescriptions FOR UPDATE TO authenticated
  USING (doctor_id = public.current_doctor_id()) WITH CHECK (doctor_id = public.current_doctor_id());

CREATE TABLE public.prescription_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  medicine_id uuid REFERENCES public.medicines(id) ON DELETE SET NULL,
  medicine_name text NOT NULL,
  strength text NOT NULL DEFAULT '',
  dosage text NOT NULL DEFAULT '',
  frequency text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  instructions text NOT NULL DEFAULT ''
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prescription_items TO authenticated;
GRANT ALL ON public.prescription_items TO service_role;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors manage own prescription items" ON public.prescription_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.prescriptions p WHERE p.id = prescription_items.prescription_id AND p.doctor_id = public.current_doctor_id()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.prescriptions p WHERE p.id = prescription_items.prescription_id AND p.doctor_id = public.current_doctor_id()));

-- PUBLIC BOOKING ROUTINE (visitors can create bookings without reading data)
CREATE SEQUENCE public.appointment_seq START 125;
CREATE SEQUENCE public.prescription_seq START 452;

CREATE OR REPLACE FUNCTION public.book_appointment(
  p_name text, p_phone text, p_email text, p_age integer, p_gender text,
  p_doctor_id uuid, p_service text, p_date date, p_time text, p_type text, p_reason text
) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_patient_id uuid;
  v_number text;
BEGIN
  IF length(coalesce(trim(p_name), '')) < 2 OR length(coalesce(trim(p_phone), '')) < 6 THEN
    RAISE EXCEPTION 'Invalid patient details';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.doctors WHERE id = p_doctor_id) THEN
    RAISE EXCEPTION 'Invalid doctor';
  END IF;

  SELECT id INTO v_patient_id FROM public.patients
   WHERE phone = trim(p_phone) AND lower(name) = lower(trim(p_name)) LIMIT 1;

  IF v_patient_id IS NULL THEN
    INSERT INTO public.patients (name, phone, email, age, gender)
    VALUES (left(trim(p_name), 100), left(trim(p_phone), 20), left(coalesce(p_email, ''), 150), p_age, left(coalesce(p_gender, ''), 20))
    RETURNING id INTO v_patient_id;
  END IF;

  v_number := 'SC-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.appointment_seq')::text, 5, '0');

  INSERT INTO public.appointments (appointment_number, patient_id, doctor_id, service, appointment_date, appointment_time, appointment_type, reason)
  VALUES (v_number, v_patient_id, p_doctor_id, left(coalesce(p_service, 'General Consultation'), 100), p_date, left(p_time, 20), left(coalesce(p_type, 'New Consultation'), 40), left(coalesce(p_reason, ''), 500));

  RETURN v_number;
END;
$$;
REVOKE ALL ON FUNCTION public.book_appointment(text, text, text, integer, text, uuid, text, date, text, text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.book_appointment(text, text, text, integer, text, uuid, text, date, text, text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.next_prescription_number()
RETURNS text LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path = public AS $$
  SELECT 'RX-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.prescription_seq')::text, 5, '0');
$$;
GRANT EXECUTE ON FUNCTION public.next_prescription_number() TO authenticated;

-- SEED: doctors
INSERT INTO public.doctors (name, email, qualification, specialization, experience_years, registration_number, phone, bio, availability) VALUES
('Dr. Anaya Sharma', 'anaya@smilecare.com', 'BDS, MDS', 'Senior Dental Surgeon', 12, 'DCI-2014-10245', '+91 98765 43210', 'Specialist in restorative dentistry and painless root canal treatment with a gentle, patient-first approach.', 'Mon - Sat'),
('Dr. Rohan Verma', 'rohan@smilecare.com', 'BDS, MDS (Orthodontics)', 'Orthodontist', 9, 'DCI-2017-11871', '+91 98765 43211', 'Aligner and braces specialist focused on comfortable, predictable smile alignment.', 'Mon - Fri'),
('Dr. Meera Iyer', 'meera@smilecare.com', 'BDS, MDS (Prosthodontics)', 'Implantologist', 11, 'DCI-2015-10998', '+91 98765 43212', 'Dental implant and full-mouth rehabilitation expert using digital implant planning.', 'Tue - Sat'),
('Dr. Kabir Nair', 'kabir@smilecare.com', 'BDS, MDS (Pedodontics)', 'Pediatric Dentist', 8, 'DCI-2018-12440', '+91 98765 43213', 'Makes dental visits fun and fear-free for children of all ages.', 'Mon - Sat');

-- SEED: problems
INSERT INTO public.problems (name, description) VALUES
('Dental Caries', 'Tooth decay caused by bacterial demineralisation of enamel.'),
('Tooth Sensitivity', 'Sharp pain triggered by cold, heat or sweet stimuli.'),
('Gingivitis', 'Reversible inflammation of the gums caused by plaque.'),
('Periodontitis', 'Inflammation affecting the supporting structures of the teeth.'),
('Toothache', 'Localised dental pain of varying intensity.'),
('Dental Infection', 'Bacterial infection of the tooth or surrounding tissue.'),
('Mouth Ulcer', 'Painful break in the oral mucosa.'),
('Gum Pain', 'Localised gingival discomfort or tenderness.'),
('Post Extraction Pain', 'Discomfort following a tooth extraction.'),
('Wisdom Tooth Pain', 'Pain associated with erupting or impacted third molars.');

-- SEED: medicines
INSERT INTO public.medicines (name, generic_name, strength, form, default_dosage, default_frequency, default_duration, instructions) VALUES
('Ibuprofen', 'Ibuprofen', '400 mg', 'Tablet', '1 tablet', 'Twice daily', '3 days', 'Take after food.'),
('Paracetamol', 'Acetaminophen', '500 mg', 'Tablet', '1 tablet', 'Three times daily', '3 days', 'Take after food.'),
('Amoxicillin', 'Amoxicillin', '500 mg', 'Capsule', '1 capsule', 'Three times daily', '5 days', 'Complete the full course.'),
('Amoxicillin + Clavulanate', 'Co-amoxiclav', '625 mg', 'Tablet', '1 tablet', 'Twice daily', '5 days', 'Take after food. Complete the full course.'),
('Metronidazole', 'Metronidazole', '400 mg', 'Tablet', '1 tablet', 'Three times daily', '5 days', 'Avoid alcohol during treatment.'),
('Chlorhexidine Mouthwash', 'Chlorhexidine gluconate', '0.2%', 'Mouthwash', '10 ml rinse', 'Twice daily', '7 days', 'Rinse for 30 seconds. Do not swallow.'),
('Benzocaine Oral Gel', 'Benzocaine', '20%', 'Gel', 'Apply locally', 'Up to three times daily', '5 days', 'Apply a thin layer on the affected area.'),
('Potassium Nitrate Toothpaste', 'Potassium nitrate', '5%', 'Toothpaste', 'Brush', 'Twice daily', '4 weeks', 'Use with a soft-bristled brush.'),
('Fluoride Varnish', 'Sodium fluoride', '5%', 'Varnish', 'In-clinic application', 'Single application', 'Once', 'Applied by the treating dentist.'),
('Diclofenac Sodium', 'Diclofenac', '50 mg', 'Tablet', '1 tablet', 'Twice daily', '3 days', 'Take after food.'),
('Warm Saline Rinse', 'Sodium chloride', '0.9%', 'Rinse', '1 glass rinse', 'Three times daily', '5 days', 'Do not swallow. Use lukewarm water.');

-- SEED: problem to medicine suggestion mapping (demo data, clinical review required)
INSERT INTO public.problem_medicines (problem_id, medicine_id)
SELECT p.id, m.id FROM public.problems p JOIN public.medicines m ON true
WHERE (p.name, m.name) IN (
  ('Dental Caries','Ibuprofen'), ('Dental Caries','Paracetamol'), ('Dental Caries','Fluoride Varnish'),
  ('Tooth Sensitivity','Potassium Nitrate Toothpaste'), ('Tooth Sensitivity','Fluoride Varnish'),
  ('Gingivitis','Chlorhexidine Mouthwash'), ('Gingivitis','Ibuprofen'), ('Gingivitis','Warm Saline Rinse'),
  ('Periodontitis','Chlorhexidine Mouthwash'), ('Periodontitis','Amoxicillin'), ('Periodontitis','Metronidazole'),
  ('Toothache','Ibuprofen'), ('Toothache','Paracetamol'), ('Toothache','Benzocaine Oral Gel'),
  ('Dental Infection','Amoxicillin'), ('Dental Infection','Amoxicillin + Clavulanate'), ('Dental Infection','Metronidazole'), ('Dental Infection','Ibuprofen'),
  ('Mouth Ulcer','Benzocaine Oral Gel'), ('Mouth Ulcer','Chlorhexidine Mouthwash'), ('Mouth Ulcer','Warm Saline Rinse'),
  ('Gum Pain','Ibuprofen'), ('Gum Pain','Chlorhexidine Mouthwash'), ('Gum Pain','Warm Saline Rinse'),
  ('Post Extraction Pain','Paracetamol'), ('Post Extraction Pain','Diclofenac Sodium'), ('Post Extraction Pain','Warm Saline Rinse'), ('Post Extraction Pain','Amoxicillin'),
  ('Wisdom Tooth Pain','Ibuprofen'), ('Wisdom Tooth Pain','Diclofenac Sodium'), ('Wisdom Tooth Pain','Chlorhexidine Mouthwash')
);

-- SEED: demo patients and today's bookings for Dr. Anaya Sharma
INSERT INTO public.patients (id, name, phone, email, age, gender) VALUES
('11111111-1111-4111-8111-111111111101', 'Rahul Mehta', '+91 90000 11101', 'rahul.mehta@example.com', 32, 'Male'),
('11111111-1111-4111-8111-111111111102', 'Sneha Kapoor', '+91 90000 11102', 'sneha.kapoor@example.com', 27, 'Female'),
('11111111-1111-4111-8111-111111111103', 'Arjun Desai', '+91 90000 11103', 'arjun.desai@example.com', 45, 'Male'),
('11111111-1111-4111-8111-111111111104', 'Ishita Rao', '+91 90000 11104', 'ishita.rao@example.com', 19, 'Female'),
('11111111-1111-4111-8111-111111111105', 'Vikram Singh', '+91 90000 11105', 'vikram.singh@example.com', 54, 'Male'),
('11111111-1111-4111-8111-111111111106', 'Aditi Menon', '+91 90000 11106', 'aditi.menon@example.com', 36, 'Female');

INSERT INTO public.appointments (appointment_number, patient_id, doctor_id, service, appointment_date, appointment_time, appointment_type, reason, status)
SELECT v.num, v.pid::uuid, d.id, v.service, CURRENT_DATE, v.time, v.type, v.reason, v.status
FROM public.doctors d,
(VALUES
 ('SC-2026-00118','11111111-1111-4111-8111-111111111101','General Consultation','09:30 AM','New Consultation','Pain in lower right molar while chewing','Waiting'),
 ('SC-2026-00119','11111111-1111-4111-8111-111111111102','Orthodontics','10:00 AM','Follow-up','Aligner review','Completed'),
 ('SC-2026-00120','11111111-1111-4111-8111-111111111103','Root Canal Treatment','11:15 AM','New Consultation','Severe toothache since two days','Waiting'),
 ('SC-2026-00121','11111111-1111-4111-8111-111111111104','Cosmetic Dentistry','12:00 PM','New Consultation','Teeth whitening consultation','Completed'),
 ('SC-2026-00122','11111111-1111-4111-8111-111111111105','Dental Implants','04:30 PM','Follow-up','Implant healing check','Waiting'),
 ('SC-2026-00123','11111111-1111-4111-8111-111111111106','General Dentistry','05:15 PM','Emergency','Bleeding gums and swelling','In Consultation')
) AS v(num, pid, service, time, type, reason, status)
WHERE d.email = 'anaya@smilecare.com';
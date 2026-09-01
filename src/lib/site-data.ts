export type Service = {
  slug: string;
  name: string;
  short: string;
  description: string;
  tone: "sky" | "lavender" | "magenta" | "mint" | "primary";
  highlights: string[];
  treatments: string[];
};

export const services: Service[] = [
  {
    slug: "general-dentistry",
    name: "General Dentistry",
    short: "Cleanings, checkups and complete oral care.",
    description:
      "Routine preventive care that keeps your teeth and gums healthy for life — from professional cleaning and scaling to fillings and oral health screening.",
    tone: "sky",
    highlights: ["Digital oral screening", "Painless scaling", "Preventive fluoride care"],
    treatments: ["Oral examination", "Scaling & polishing", "Tooth-coloured fillings", "Fluoride application"],
  },
  {
    slug: "dental-implants",
    name: "Dental Implants",
    short: "Permanent solutions for missing teeth.",
    description:
      "Digitally planned titanium implants that restore the look, feel and function of natural teeth with long-term stability.",
    tone: "lavender",
    highlights: ["Guided implant planning", "Single & multiple implants", "Full-mouth rehabilitation"],
    treatments: ["Single tooth implant", "Implant bridge", "All-on-4 rehabilitation", "Bone grafting"],
  },
  {
    slug: "orthodontics",
    name: "Orthodontics",
    short: "Braces and aligners for a perfect smile.",
    description:
      "Modern alignment treatment with metal, ceramic and clear aligner options planned around your lifestyle and comfort.",
    tone: "magenta",
    highlights: ["Clear aligners", "Ceramic braces", "Digital treatment simulation"],
    treatments: ["Metal braces", "Ceramic braces", "Clear aligners", "Retainers"],
  },
  {
    slug: "cosmetic-dentistry",
    name: "Cosmetic Dentistry",
    short: "Whitening, veneers and smile makeovers.",
    description:
      "Smile design treatments that improve shape, shade and symmetry while keeping your smile natural-looking.",
    tone: "primary",
    highlights: ["Digital smile design", "In-clinic whitening", "Porcelain veneers"],
    treatments: ["Teeth whitening", "Veneers", "Composite bonding", "Gum contouring"],
  },
  {
    slug: "root-canal",
    name: "Root Canal Treatment",
    short: "Relief from pain and save natural teeth.",
    description:
      "Single-visit rotary endodontics that removes infection, relieves pain and preserves your natural tooth structure.",
    tone: "mint",
    highlights: ["Single-visit RCT", "Rotary endodontics", "Painless anaesthesia"],
    treatments: ["Root canal therapy", "Re-treatment", "Post & core", "Crown placement"],
  },
  {
    slug: "pediatric-dentistry",
    name: "Pediatric Dentistry",
    short: "Gentle, fear-free dentistry for children.",
    description:
      "Child-friendly dental care built on trust, play and prevention — so children grow up without dental fear.",
    tone: "sky",
    highlights: ["Behaviour-friendly care", "Sealants", "Habit correction"],
    treatments: ["Child checkup", "Pit & fissure sealants", "Pulpectomy", "Space maintainers"],
  },
  {
    slug: "oral-surgery",
    name: "Oral Surgery",
    short: "Extractions and minor surgical care.",
    description:
      "Safe surgical procedures including wisdom tooth removal, performed under strict sterilisation protocols.",
    tone: "lavender",
    highlights: ["Wisdom tooth removal", "Minor oral surgery", "Post-op care plan"],
    treatments: ["Simple extraction", "Surgical extraction", "Impacted third molar", "Biopsy"],
  },
];

export const serviceNames = services.map((s) => s.name);

export const trustFeatures = [
  { title: "Advanced Technology", text: "Modern dental equipment and digital diagnostics." },
  { title: "Pain-Free Treatment", text: "Comfort-focused treatment experience." },
  { title: "Experienced Doctors", text: "Qualified dental specialists across specialities." },
  { title: "Sterilized Environment", text: "Safe and hygienic clinical environment." },
];

export const technologies = [
  { name: "Digital X-Ray", text: "Low-radiation instant imaging for precise diagnosis." },
  { name: "Intraoral Scanner", text: "Impression-free digital scans, no messy putty." },
  { name: "Digital Smile Design", text: "Preview your new smile before treatment begins." },
  { name: "CAD/CAM", text: "Precision-milled crowns with an exact fit." },
  { name: "3D Dental Imaging", text: "Volumetric planning for implants and surgery." },
  { name: "Laser Dentistry", text: "Minimally invasive gum and soft-tissue care." },
];

export const stats = [
  { value: "10+", label: "Experienced Doctors" },
  { value: "2K+", label: "Happy Patients" },
  { value: "15+", label: "Dental Treatments" },
  { value: "10+", label: "Years of Excellence" },
];

export const testimonials = [
  {
    name: "Rahul Mehta",
    treatment: "Root Canal Treatment",
    rating: 5,
    review:
      "The staff were extremely friendly and the treatment experience was very comfortable. I felt almost no pain during my root canal.",
  },
  {
    name: "Sneha Kapoor",
    treatment: "Clear Aligners",
    rating: 5,
    review:
      "My aligner journey was explained clearly at every visit. The digital simulation showed exactly what to expect.",
  },
  {
    name: "Aditi Menon",
    treatment: "Gum Treatment",
    rating: 4,
    review:
      "Very hygienic clinic and the doctor took time to answer all my questions. My gum problem improved within a week.",
  },
  {
    name: "Vikram Singh",
    treatment: "Dental Implants",
    rating: 5,
    review:
      "The implant planning was impressively precise. Six months later it feels exactly like my own tooth.",
  },
];

export const clinicInfo = {
  address: "123 Smile Street, New Delhi, India",
  phone: "+91 98765 43210",
  email: "info@smilecare.com",
  hours: [
    { days: "Monday – Friday", time: "9:00 AM – 7:00 PM" },
    { days: "Saturday", time: "9:00 AM – 5:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
};

export const appointmentTypes = ["New Consultation", "Follow-up", "Emergency"];

export const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
];

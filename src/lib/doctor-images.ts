import anaya from "@/assets/doctor-anaya.jpg";
import rohan from "@/assets/doctor-rohan.jpg";
import meera from "@/assets/doctor-meera.jpg";
import kabir from "@/assets/doctor-kabir.jpg";
import team from "@/assets/dental-team.jpg";

const map: Record<string, string> = {
  "anaya@smilecare.com": anaya,
  "rohan@smilecare.com": rohan,
  "meera@smilecare.com": meera,
  "kabir@smilecare.com": kabir,
};

export function doctorImage(email: string | null | undefined): string {
  if (!email) return team;
  return map[email.toLowerCase()] ?? team;
}

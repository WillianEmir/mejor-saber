import { getTestimonios, getUsersForSelect } from "./lib/testimonio.data";
import Testimonios from "./components/TestimoniosList";

export default async function TestimoniosPage() {
  const [testimonios, users] = await Promise.all([
    getTestimonios(),
    getUsersForSelect(),
  ]);

  return <Testimonios initialTestimonios={testimonios ?? []} users={users ?? []} />;
}

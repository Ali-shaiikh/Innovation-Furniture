// Server component — fetches categories from Strapi then passes them to the
// client Navbar so nav links always reflect actual Strapi slugs.
import { getCategories } from "@/lib/strapi";
import Navbar from "./Navbar";

export default async function NavbarServer() {
  const categories = await getCategories();
  return (
    <Navbar
      categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
    />
  );
}

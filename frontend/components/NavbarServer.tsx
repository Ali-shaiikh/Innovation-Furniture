// Server component — fetches categories from Sanity then passes them to the
// client Navbar so nav links always reflect actual slugs.
import { getCategories } from "@/lib/sanity";
import Navbar from "./Navbar";

export default async function NavbarServer() {
  const categories = await getCategories();
  return (
    <Navbar
      categories={categories.map((c) => ({
        name: c.name,
        slug: typeof c.slug === "string" ? c.slug : c.slug.current,
      }))}
    />
  );
}

import { auth } from "@/auth";
import { getMovieCategories, getMovieCountries } from "@/lib/ophim";
import { HeaderNavigation } from "./header-navigation";

export async function Header() {
  const [session, categoriesResult, countriesResult] = await Promise.all([
    auth(),
    getMovieCategories().then(
      (items) => ({ items, failed: false }),
      () => ({ items: [], failed: true }),
    ),
    getMovieCountries().then(
      (items) => ({ items, failed: false }),
      () => ({ items: [], failed: true }),
    ),
  ]);

  return (
    <HeaderNavigation
      categories={categoriesResult.items}
      categoriesUnavailable={categoriesResult.failed}
      countries={countriesResult.items}
      countriesUnavailable={countriesResult.failed}
      user={
        session?.user
          ? {
              name: session.user.name,
              email: session.user.email,
            }
          : null
      }
    />
  );
}

import { auth } from "@/auth";
import { HeaderNavigation } from "./header-navigation";

export async function Header() {
  const session = await auth();

  return (
    <HeaderNavigation
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

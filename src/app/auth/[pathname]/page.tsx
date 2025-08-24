import { AuthView } from "./view";

const authViewPaths = {
  signIn: "sign-in",
  signUp: "sign-up",
};

export function generateStaticParams() {
  return Object.values(authViewPaths).map((pathname) => ({ pathname }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ pathname: string }>;
}) {
  const { pathname } = await params;

  return <AuthView pathname={pathname} />;
}

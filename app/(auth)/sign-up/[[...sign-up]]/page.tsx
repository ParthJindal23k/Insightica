import { SignUp } from "@clerk/nextjs";
import AuthShell from "@/app/_components/AuthShell";

export default function Page() {
  return (
    <AuthShell>
      <SignUp />
    </AuthShell>
  );
}

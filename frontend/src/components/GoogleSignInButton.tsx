"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function GoogleSignInButton() {
  const router = useRouter();
  const { googleLogin } = useAuth();

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            await googleLogin(credentialResponse.credential || "");
            toast.success("Signed in successfully!");
            router.push("/");
          } catch {
            toast.error("Google sign-in failed. Please try again.");
          }
        }}
        onError={() => toast.error("Google sign-in failed")}
        type="standard"
        theme="outline"
        size="large"
        text="signin_with"
        shape="rectangular"
        width="100%"
        logo_alignment="left"
      />
    </div>
  );
}

"use client";

import React, { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Logo from "@/components/common/Logo";
import FormModule from "./modules/FormModule/FormModule";
import SocialLogin from "./modules/SocialLogin/SocialLogin";
import Header from "./modules/Header/Header";
import Loading from "@/components/Ui/Loading";
import Image from "next/image";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const redirectBasedOnRole = useCallback(
    (role?: string) => {
      switch (role) {
        case "ADMIN":
        case "SELLER":
          router.push("/admin");
          break;
        case "WHOLESALER":
          router.push("/mayorista");
          break;
        case "CUSTOMER":
          router.push("/cliente");
          break;
        default:
          router.push("/");
      }
    },
    [router]
  );

  useEffect(() => {
    if (status === "authenticated") {
      redirectBasedOnRole(session?.user?.role);
    }
  }, [status, session, redirectBasedOnRole]);

  if (status === "loading") {
    return <Loading />; // Show loading component while session is loading
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      {/* Login Container */}
      <div className="flex flex-col md:flex-row border rounded-[30px] p-4 bg-white shadow-lg w-full max-w-[930px] mx-auto">
        {/* Left Box */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-black rounded-[30px] p-6 md:p-4">
          <div className="mb-4">
            <Image
              src="/assets/Alta-Blanco.png"
              alt="Alta Telefonia Logo"
              width={200}
              height={200}
            />
          </div>
        </div>
        {/* Right Box */}
        <div className="w-full md:w-1/2 p-6 md:p-8">
          <div className="flex flex-col items-center">
            <Header />
            <FormModule redirectBasedOnRole={redirectBasedOnRole} />
            <SocialLogin />
          </div>
        </div>
      </div>
    </div>
  );
}

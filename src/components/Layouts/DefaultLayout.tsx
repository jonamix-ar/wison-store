"use client";

import * as React from "react";
import { ShoppingCart } from "lucide-react";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import Loading from "@/components/Ui/Loading";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loading />; // Show loading component while session is loading
  }

  if (status !== "authenticated" || !session) {
    return null; // Do not render if unauthenticated
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex flex-1 flex-col">
        {/* Top Navigation */}
        <Header />

        {/* Search Bar and Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DefaultLayout;

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Error de Autenticación</h1>
      {error === "OAuthAccountNotLinked" ? (
        <p className="mb-4 text-center">
          Para confirmar tu identidad, inicia sesión con la misma cuenta que
          usaste originalmente.
        </p>
      ) : (
        <p className="mb-4 text-center">
          Ha ocurrido un error durante la autenticación.
        </p>
      )}
      <Link
        href="/login"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Volver al inicio de sesión
      </Link>
    </div>
  );
}

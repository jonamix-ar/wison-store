import Link from "next/link";
import { Button } from "@/components/Ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">
          Página no encontrada
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Oops! La página que buscas no existe.
        </p>
        <Link href="/" passHref>
          <Button variant="default" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}

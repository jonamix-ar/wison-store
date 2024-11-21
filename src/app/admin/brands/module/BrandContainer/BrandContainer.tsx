import EmptyBig from "@/components/common/EmptyBig";
import Loading from "@/components/Ui/Loading";
import { getBrands } from "@/services/products-service";
import { Brand } from "@/types/products";
import { Box, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BrandList from "../BrandList/BrandList";

interface BrandContainerProps {
    pageSize: number;
    columns: { id: string; header: string }[];
    searchTerm: string;
}

const BrandContainer: React.FC<BrandContainerProps> = ({
    pageSize,
    columns,
    searchTerm,
}) => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                setIsLoading(true);
                const response = await getBrands();
                setBrands(response);
            } catch (error) {
                console.error("Error fetching brands:", error);
                setError("Failed to fetch brands. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBrands();
    }, []);

    const filteredBrands = useMemo(() => {
        return brands.filter((brand) =>
            Object.values(brand).some((value) =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [brands, searchTerm]);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleCreateBrands = () => {
        return router.push("/admin/brands/create");
    };

    return (
        <>
            {filteredBrands.length > 0 ? (
                <BrandList brands={filteredBrands} pageSize={pageSize} columns={columns} />
            ) : (
                <EmptyBig
                    emptyStateMessage="Aún no tienes marcas"
                    emptyStateDescription="Crea tu primera marca y empieza a vender."
                    icon={<Box className="mx-auto h-16 w-16 text-gray-400" />}
                    button={
                        <button
                            onClick={handleCreateBrands}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white bg-emerald-500 hover:bg-emerald-600"
                        >
                            <Plus className="h-4 w-4" />
                            Crear marca
                        </button>
                    }
                />
            )
            }
        </>
    );
}


export default BrandContainer
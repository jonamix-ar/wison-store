import React, { useEffect, useMemo, useState } from 'react';
import { Category } from "@/types/products"
import { getCategories } from "@/services/products-service";
import Loading from "@/components/Ui/Loading";
import UserList from "@/app/admin/users/module/UserList/UserList";
import EmptyBig from "@/components/common/EmptyBig";
import { Box, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import CategoryList from "@/app/admin/categories/module/CategoryList/CategoryList";

interface CategoryContainerProps {
    pageSize: number;
    columns: { id: string; header: string }[];
    searchTerm: string;
}

const CategoryContainer: React.FC<CategoryContainerProps> = ({
    pageSize,
    columns,
    searchTerm,
}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const response = await getCategories();
                setCategories(response);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to fetch users. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const filteredCategories = useMemo(() => {
        return categories.filter((category) =>
            Object.values(category).some((value) =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [categories, searchTerm]);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleCreateCategories = () => {
        return router.push("/admin/categories/create");
    };

    return (
        <>
            {categories.length > 0 ? (
                <CategoryList categories={filteredCategories} pageSize={pageSize} columns={columns} />
            ) : (
                <EmptyBig
                    emptyStateMessage="Aún no tienes categorias"
                    emptyStateDescription="Crea tu primera categoria y empieza a vender."
                    icon={<Box className="mx-auto h-16 w-16 text-gray-400" />}
                    button={
                        <button
                            onClick={handleCreateCategories}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white bg-emerald-500 hover:bg-emerald-600"
                        >
                            <Plus className="h-4 w-4" />
                            Crear categoria
                        </button>
                    }
                />
            )
            }
        </>
    );
}

export default CategoryContainer;
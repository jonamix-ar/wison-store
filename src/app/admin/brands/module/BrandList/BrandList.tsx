import { Brand } from "@/types/products";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import Table from "@/components/Table/Table";
import Image from "next/image";

interface BrandListProps {
    brands: Brand[];
    pageSize: number;
    columns?: { id: string; header: string }[];
}

interface ImageCellProps {
    imagePath: string | null
    altText?: string
}

const BrandList: React.FC<BrandListProps> = ({
    brands,
    pageSize,
    columns = []
}) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const tableColumns: ColumnDef<Brand>[] = [
        {
            accessorKey: "id",
            header: "#ID",
            cell: (info) => info.getValue(),
            size: 5,
        },
        {
            accessorKey: "name",
            header: "Marca",
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: "description",
            header: "Descripción",
            cell: (info) => (
                <div
                    dangerouslySetInnerHTML={{
                        __html: info.getValue() as string,
                    }}
                />
            ),
        },
        {
            accessorKey: "picture",
            header: "Imagen",
            cell: (info) => {
                const imgSrcPlaceholder = '/assets/placeholder.svg';
                const baseUploadUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
                const fullImageUrl = info.row.original.picture ? `${baseUploadUrl}${info.row.original.picture}` : imgSrcPlaceholder;
                console.log(fullImageUrl);
                return (
                    <Image
                        src={fullImageUrl}
                        alt="Brand image"
                        width={50}
                        height={50}
                        style={{ objectFit: 'cover' }}
                    />
                );
            }
        },
        {
            accessorKey: "status",
            header: "Estado",
            cell: (info) => {
                const statusMap: Record<string, string> = {
                    'true': 'Activo',
                    'false': 'Inactivo'
                };

                return statusMap[String(info?.row?.original?.status)] || 'Desconocido';
            }
        },
        {
            accessorKey: "actions",
            header: () => <div className="text-center">Acciones</div>,
            cell: (info) => {
                const viewUrl = `/admin/brands/${info.row.original.id}`;
                const categoryId = info.row.original.id;

                return (
                    <div className="flex gap-0">
                        <Link
                            href={viewUrl}
                            className="hover:text-blue-700 text-gray-700 font-bold py-2.5 px-2.5 rounded hover:bg-gray-200"
                        >
                            <Edit className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={() => handleDelete(categoryId)}
                            disabled={isDeleting}
                            className={`hover:text-red-700 text-gray-700 font-bold py-2.5 px-2.5 rounded hover:bg-gray-200 ${isDeleting ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                );
            },
            size: 10,
        },
    ]

    const handleDelete = async (categoryId: number) => {
        if (isDeleting) return;

        setIsDeleting(true);
        try {
            // const response = await deleteCategory(categoryId);
            toast.success("Categoría eliminada exitosamente!");
            // Refresh the current route and fetch new data from the server
            window.location.reload();
        } catch (error) {
            console.error("Error deleting category:", error);
            if (error instanceof Error) {
                if (error.message.includes("Cannot delete category due to existing references")) {
                    toast.error("No se puede eliminar la categoría. Está asociada con productos existentes.");
                } else {
                    toast.error(error.message);
                }
            } else {
                toast.error("Error al eliminar la categoría. Por favor, inténtelo de nuevo.");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    if (columns.length === 0) {
        return <div>No columns defined for the brands list.</div>;
    }

    return (
        <div className="space-y-4">
            <Table columns={tableColumns} data={brands} pageSize={pageSize} />
        </div>
    );
}

export default BrandList
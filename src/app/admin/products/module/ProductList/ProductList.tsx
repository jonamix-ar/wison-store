import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types/products";
import Table from "@/components/Table/Table";
import { formatCurrency } from "@/utils/formatUtils";
import Badge from "@/components/Ui/Badges/Badge";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/services/products-service";
import { toast } from "react-toastify";
import EnhancedStockStatus from "../EnhancedStockStatus/EnhancedStockStatus";

interface ProductListProps {
  products: Product[];
  pageSize: number;
  columns?: { id: string; header: string }[];
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  pageSize,
  columns = [],
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (productId: number) => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      toast.success("¡Producto eliminado exitosamente!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error instanceof Error) {
        if (
          error.message.includes(
            "Cannot delete product due to existing references"
          )
        ) {
          toast.error(
            "Cannot delete product. It is associated with existing sales or other records."
          );
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to delete product. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const tableColumns: ColumnDef<Product>[] = [
    {
      accessorKey: "id",
      header: "#ID",
      cell: (info) => info.getValue(),
      size: 5,
    },
    {
      accessorKey: "category-brand",
      header: "Cate./Marcas",
      cell: (info) => {
        const category = info.row.original.category.name;
        const brand = info.row.original.brand.name;
        return (
          <div className="flex gap-2">
            <Badge className="px-2 py-1 rounded-full text-white font-semibold bg-blue-500 text-xs">
              {category}
            </Badge>
            <Badge className="px-2 py-1 rounded-full text-white font-semibold bg-gray-500 text-xs">
              {brand}
            </Badge>
          </div>
        );
      },
      size: 10,
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "price",
      header: "Precio",
      cell: (info) => {
        return formatCurrency(parseFloat(info.row.original.attributes?.length > 0 ? info.row.original.attributes[0].price : info.row.original.price));
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: (info) => {
        return info.row.original.attributes?.length > 0 ? info.row.original.attributes[0].qty : info.row.original.qty;
      }
    },
    {
      accessorKey: "state",
      header: "Estado",
      cell: ({ row }) => {
        const { qty, qtyBellowMin, attributes } = row.original
        return <EnhancedStockStatus qty={qty} qtyBellowMin={qtyBellowMin} attributes={attributes} />
      },
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de creación",
      cell: (info) =>
        new Date(info.getValue() as string).toLocaleString("es-ES"),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-center">Acciones</div>,
      cell: (info) => {
        const viewUrl = `/admin/products/${info.row.original.id}`;
        const productId = info.row.original.id;

        return (
          <div className="flex gap-0">
            <Link
              href={viewUrl}
              className="hover:text-blue-700 text-gray-700 font-bold py-2.5 px-2.5 rounded hover:bg-gray-200"
            >
              <Edit className="w-5 h-5" />
            </Link>
            <button
              onClick={() => handleDelete(productId)}
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
  ];

  if (columns.length === 0) {
    return <div>No columns defined for the product list.</div>;
  }

  return (
    <div className="space-y-4">
      <Table columns={tableColumns} data={products} pageSize={pageSize} />
    </div>
  );
};

export default ProductList;

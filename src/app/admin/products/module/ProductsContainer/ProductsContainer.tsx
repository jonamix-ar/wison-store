"use client";

import { useEffect, useMemo, useState } from "react";
import EmptyBig from "@/components/common/EmptyBig";
import { Box, Plus } from "lucide-react";
import { getAllProducts } from "@/services/products-service";
import ProductList from "../ProductList/ProductList";
import ProductGrid from "../ProductGrid/ProductGrid";
import { Product, ViewMode } from "@/types/products";

interface ProductsContainerProps {
  viewMode: ViewMode;
  pageSize: number;
  columns: { id: string; header: string }[];
  searchTerm: string;
}

const ProductsContainer: React.FC<ProductsContainerProps> = ({
  viewMode,
  pageSize,
  columns,
  searchTerm,
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        console.log(response);
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleCreateProduct = () => {
    // Implement your create product logic here
    console.log("Create product clicked");
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      Object.values(product).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [products, searchTerm]);

  return (
    <>
      {filteredProducts.length > 0 ? (
        viewMode === "list" ? (
          <ProductList
            products={filteredProducts}
            pageSize={pageSize}
            columns={columns}
          />
        ) : (
          <ProductGrid products={filteredProducts} />
        )
      ) : (
        <EmptyBig
          emptyStateMessage="Aún no tienes productos"
          emptyStateDescription="Crea tu primer producto y comienza a gestionar tus ventas de manera efectiva."
          icon={<Box className="mx-auto h-16 w-16 text-gray-400" />}
          button={
            <button
              onClick={handleCreateProduct}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white bg-emerald-500 hover:bg-emerald-600"
            >
              <Plus className="h-4 w-4" />
              Crear producto
            </button>
          }
        />
      )}
    </>
  );
};

export default ProductsContainer;

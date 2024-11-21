"use client";

import { useState } from "react";
import ProductsHeader from "./module/ProductsHeader/ProductsHeader";
import ProductsContainer from "./module/ProductsContainer/ProductsContainer";

export default function AdminProducts() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const columns = [
    { id: "id", header: "#ID" },
    { id: "category-brand", header: "Cate./ Marca" },
    { id: "name", header: "Nombre" },
    { id: "price", header: "Precio" },
    { id: "stock", header: "Stock" },
    { id: "createdAt", header: "Fecha de creación" },
    { id: "actions", header: "Acciones" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((col) => col.id)
  );

  return (
    <>
      <ProductsHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        pageSize={pageSize}
        setPageSize={setPageSize}
        columns={columns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="mt-4">
        <ProductsContainer
          viewMode={viewMode}
          pageSize={pageSize}
          columns={columns.filter((col) => visibleColumns.includes(col.id))}
          searchTerm={searchTerm}
        />
      </div>
    </>
  );
}

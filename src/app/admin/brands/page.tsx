"use client"
import { useState } from "react";
import BrandHeader from "./module/BrandHeader/BrandHeader";
import BrandContainer from "./module/BrandContainer/BrandContainer";

export default function BrandsPage() {
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const columns = [
        { id: "id", header: "#ID" },
        { id: "name", header: "Categoria" },
        { id: "description", header: "Descripción" },
        { id: "status", header: "Estado" },
        { id: "actions", header: "Acciones" },
    ];

    const [visibleColumns, setVisibleColumns] = useState(
        columns.map((col) => col.id)
    );

    return (
        <>
            <BrandHeader
                pageSize={pageSize}
                setPageSize={setPageSize}
                columns={columns}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            <div className="mt-4">
                <BrandContainer
                    pageSize={pageSize}
                    columns={columns.filter((col) => visibleColumns.includes(col.id))}
                    searchTerm={searchTerm}
                />
            </div>
        </>
    )
}
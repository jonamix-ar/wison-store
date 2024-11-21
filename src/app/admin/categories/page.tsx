"use client";
import React, {useState} from "react";
import CategoryHeader from "@/app/admin/categories/module/CategoryHeader/CategoryHeader";
import CategoryContainer from "@/app/admin/categories/module/CategoryContainer/CategoryContainer";

export default function Categories() {
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const columns = [
        {id: "id", header: "#ID"},
        {id: "name", header: "Categoria"},
        {id: "description", header: "Descripción"},
        {id: "status", header: "Estado"},
        {id: "actions", header: "Acciones"},
    ];

    const [visibleColumns, setVisibleColumns] = useState(
        columns.map((col) => col.id)
    );

    return (
        <>
            <CategoryHeader
                pageSize={pageSize}
                setPageSize={setPageSize}
                columns={columns}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className="mt-4">
                <CategoryContainer pageSize={pageSize}
                                   columns={columns.filter((col) => visibleColumns.includes(col.id))}
                                   searchTerm={searchTerm}/>
            </div>
        </>
    );
}
  
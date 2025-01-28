"use client";
import { useState } from "react";
import CustomerHeader from "@/components/Customers/CustomerHeader/CustomerHeader";
import CustomerContainer from "@/components/Customers/CustomerContainer/CustomerContainer";

export default function CustomerPages() {
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const columns = [
        { id: "id", header: "#ID" },
        { id: "name", header: "Usuario" },
        { id: "email", header: "Correo electrónico" },
        { id: "role", header: "Rol" },
        { id: "states", header: "Estados" },
        { id: "city", header: "Ciudad" },
        { id: "actions", header: "Acciones" },
    ];

    const [visibleColumns, setVisibleColumns] = useState(
        columns.map((col) => col.id)
    );

    return (
        <>
            <CustomerHeader
                pageSize={pageSize}
                setPageSize={setPageSize}
                columns={columns}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            <div className="mt-4">
                <CustomerContainer
                    pageSize={pageSize}
                    columns={columns.filter((col) => visibleColumns.includes(col.id))}
                    searchTerm={searchTerm}
                />
            </div>
        </>
    );
}
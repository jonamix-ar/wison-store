"use client";
import { useState } from "react";

export default function CustomerPage() {
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
            <div className="mt-4">

            </div>
        </>
    );
}
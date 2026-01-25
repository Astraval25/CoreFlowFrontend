import { coreApi } from "../../../shared/services/coreApi"
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

const useItemsPage = () => {
    const [companyId, setCompanyId] = useState("");
    const [globalFilter, setGlobalFilter] = useState("");
    const [items, setItems] = useState([]);
    const [allItems, setAllItems] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decode = jwtDecode(token);
        const compId = decode.defaultComp[0];

        setCompanyId(compId);
        fetchItems(compId);
    }, []);

    // get all items
    const fetchItems = async (companyId) => {
        coreApi.getItems(companyId).then((res) => {
            const data = res.data.responseData;
            setAllItems(data);
            setItems(data.filter((item) => item.isActive === true));
        })
    }

    // table columns
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor("sno", { header: "S.No" }),
        columnHelper.accessor("itemName", { header: "Item Name" }),
        columnHelper.accessor("itemType", { header: "Item Type" }),
        columnHelper.accessor("unit", { header: "Unit" }),
        columnHelper.accessor("salesPrice", { header: "Salse Price" }),
        columnHelper.accessor("preferredCustomerName", { header: "Customer Name" }),
        columnHelper.accessor("purchasePrice", { header: "Purchase Price" }),
        columnHelper.accessor("preferredVendorName", { header: "Vendor Name" }),
        columnHelper.accessor("action", { header: "Action" }),
    ];

    const table = useReactTable({
        data: items,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return {
        items, setItems, companyId, table,
        globalFilter,
        setGlobalFilter,
        allItems,
    }
}

export default useItemsPage;
import { useEffect, useState } from "react";
import { coreApi } from "../../../shared/services/coreApi";
import { jwtDecode } from "jwt-decode";
import {
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

const usePurchasePage = () => {
    const [companyId, setCompanyId] = useState("");
    const [allOrder, setAllOrder] = useState([]);
    const [order, setOrder] = useState([])
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decode = jwtDecode(token);
        const compId = decode.defaultComp[0];

        setCompanyId(compId);
        fetchAllOrder(compId);
    }, []);

    // get all purchase order 
    const fetchAllOrder = async (compId) => {
        coreApi.getAllPurchase(compId).then((res) => {
            const data = res.data.responseData;
            setAllOrder(data)
            setOrder(data.filter((order) => order.isActive === true));
        })
    }

    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor("sno", { header: "S.No" }),
        columnHelper.accessor("orderNumber", { header: "Order Number" }),
        columnHelper.accessor("orderDate", { header: "Order Date" }),
        columnHelper.accessor("sellerCompanyName", { header: "Seller Company" }),
        columnHelper.accessor("customerName", { header: "Customer Name" }),
        columnHelper.accessor("totalAmount", { header: "Total Amount" }),
        columnHelper.accessor("paidAmount", { header: "Paid Amount" }),
        columnHelper.accessor("orderStatus", { header: "Order Status" }),
        columnHelper.accessor("action", { header: "Action" }),
    ];

    const table = useReactTable({
        data: order,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return {
        companyId,
        allOrder,
        order,
        setOrder,
        table,
        globalFilter,
        setGlobalFilter
    }
}

export default usePurchasePage;
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

const useSalesPage = () => {
    const [companyId, setCompanyId] = useState("");
    const [sales, setSales] = useState([]);
    const [allSales, setAllSales] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decode = jwtDecode(token);
        const compId = decode.defaultComp[0];

        setCompanyId(compId);
        getAllSalesOrder(compId);
    }, []);

    const getAllSalesOrder = (compId) => {
        coreApi
            .getAllSales(compId)
            .then((res) => {
                const data = res.data.responseData || [];
                setAllSales(data);
                setSales(data.filter((s) => s.isActive === true));
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const deactivateSalesOrder = async (orderId) => {
        try {
            await coreApi.deactivateSales(companyId, orderId);
            getAllSalesOrder(companyId);
        } catch (err) {
            console.error("Deactivate sales order error:", err);
        }
    };

    const activateSalesOrder = async (orderId) => {
        try {
            await coreApi.activateSales(companyId, orderId);
            getAllSalesOrder(companyId);
        } catch (err) {
            console.error("Activate sales order error:", err);
        }
    };

    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor("sno", { header: "S.No" }),
        columnHelper.accessor("orderNumber", { header: "Order Number" }),
        columnHelper.accessor("orderDate", { header: "Order Date" }),
        columnHelper.accessor("sellerCompanyName", { header: "Seller" }),
        columnHelper.accessor("customerName", { header: "Customer" }),
        columnHelper.accessor("totalAmount", { header: "Total Amount" }),
        columnHelper.accessor("paidAmount", { header: "Paid Amount" }),
        columnHelper.accessor("orderStatus", { header: "Status" }),
        columnHelper.accessor("action", { header: "Action" }),
    ];

    const table = useReactTable({
        data: sales,
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
        sales,
        allSales,
        setSales,
        table,
        globalFilter,
        setGlobalFilter,
        deactivateSalesOrder,
        activateSalesOrder,
    };
};

export default useSalesPage;
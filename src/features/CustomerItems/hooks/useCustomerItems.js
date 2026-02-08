import { useEffect } from "react"
import { coreApi } from "../../../shared/services/coreApi"
import { useState } from 'react'
import { jwtDecode } from "jwt-decode"

const useCustomerItems = (customerId) => {

    const [companyId, setCompanyId] = useState("");
    const [items, setItems] = useState([]);

    // Get companyId and fetch items
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const compId = decoded?.defaultComp?.[0] || "";
        setCompanyId(compId);

        coreApi.getCustomerMappedItems(compId, customerId)
            .then((res) => {
                setItems(res.data.responseData || []);
            })

    }, [customerId]);

    return { items, companyId };
}

export default useCustomerItems;
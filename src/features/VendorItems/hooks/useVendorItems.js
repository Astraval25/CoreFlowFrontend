import { useEffect } from "react"
import { coreApi } from "../../../shared/services/coreApi"
import { useState } from 'react'
import { jwtDecode } from "jwt-decode"

const useVendorItems = (vendorId) => {

    const [companyId, setCompanyId] = useState("");
    const [items, setItems] = useState([]);
    const [itemImages, setItemImages] = useState({});

    const fetchItems = async (compId) => {
        if (compId && vendorId) {
            try {
                const res = await coreApi.getVendorMappedItems(compId, vendorId);
                const itemsData = res.data.responseData || [];

                // Sort items by itemId to maintain consistent order
                const sortedItems = itemsData.sort((a, b) => a.itemId - b.itemId);
                setItems(sortedItems);

                // Fetch images for items that have fsId
                const imagePromises = sortedItems.map(async (item) => {
                    if (item.fsId) {
                        try {
                            const imgRes = await coreApi.downloadFile(item.fsId);
                            const blobUrl = URL.createObjectURL(imgRes.data);
                            return { itemId: item.itemId, imageUrl: blobUrl };
                        } catch (error) {
                            console.error(`Error loading image for item ${item.itemId}:`, error);
                            return null;
                        }
                    }
                    return null;
                });

                const images = await Promise.all(imagePromises);
                const imageMap = {};
                images.forEach(img => {
                    if (img) imageMap[img.itemId] = img.imageUrl;
                });
                setItemImages(imageMap);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const compId = decoded?.defaultComp?.[0] || "";
        setCompanyId(compId);

        fetchItems(compId);
    }, [vendorId]);

    const refetch = () => {
        fetchItems(companyId);
    };

    const toggleItemStatus = async (itemId, isActive) => {
        try {
            if (isActive) {
                await coreApi.deactivateVendorItem(companyId, vendorId, itemId);
            } else {
                await coreApi.activateVendorItem(companyId, vendorId, itemId);
            }
            refetch();
        } catch (error) {
            console.error("Error toggling item status:", error);
            throw error;
        }
    };

    return { items, companyId, refetch, itemImages, toggleItemStatus };
}

export default useVendorItems;

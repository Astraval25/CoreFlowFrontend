import { useState, useEffect } from "react";
import { coreApi } from "../../../shared/services/coreApi";

const useViewItemDetail = (companyId, itemId) => {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchItemDetail = async () => {
            if (!companyId || !itemId) return;

            try {
                setLoading(true);
                setError(null);
                const response = await coreApi.getItemDetail(companyId, itemId);
                const data = response.data.responseData;
                setItem(data);

                if (data.itemImage) {
                    const imgRes = await coreApi.downloadFile(data.itemImage);
                    const blobUrl = URL.createObjectURL(imgRes.data);
                    setImageUrl(blobUrl);
                }
            } catch (err) {
                setError("Failed to load item details");
                console.error("Error fetching item detail:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetail();
    }, [companyId, itemId]);

    return { item, imageUrl, loading, error };
};

export default useViewItemDetail;
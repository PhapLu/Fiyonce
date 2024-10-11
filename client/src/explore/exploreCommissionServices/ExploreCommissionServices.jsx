// Imports
import { Outlet, useOutletContext, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";

// Components
import RenderComissionServices from "../../components/crudCommissionService/render/RenderCommissionServices.jsx"
import { apiUtils } from "../../utils/newRequest.js";

export default function ExploreCommissionServices() {
    // Fetch recommended commission services
    const { selectedRecommender, selectedMovement } = useOutletContext(); // Add this to use the context
    const [filteredCommissionServices, setFilteredCommissionServices] = useState([]);

    const [searchParams] = useSearchParams();
    const movementId = searchParams.get('movementId');




    const fetchRecommendedCommissionServices = async () => {
        try {
            let endpoint;
            const movementId = searchParams.get('movementId');

            switch (selectedRecommender.algorithm) {
                case "following":
                    endpoint = `/recommender/readFollowingCommissionServices`;
                    break;
                case "latest":
                    endpoint = `/recommender/readLatestCommissionServices`;
                    break;
                case "popular":
                default:
                    endpoint = `/recommender/readPopularCommissionServices`;
                    break;
            }

            // Append movementId to the endpoint if available
            if (movementId) {
                endpoint += `?movementId=${movementId}`;
            }

            const response = await apiUtils.get(endpoint);
            const commissionServices = response?.data?.metadata?.commissionServices || [];
            return commissionServices;
        } catch (error) {
            console.error("Error fetching commission services:", error);
            return [];
        }
    };


    const { data: commissionServices, error, isError, isLoading } = useQuery(
        ['fetchRecommendedCommissionServices', selectedRecommender, movementId],
        fetchRecommendedCommissionServices,
        {
            onSuccess: (data) => setFilteredCommissionServices(data),
            onError: (error) => console.error('Error fetching commissionServices:', error),
        }
    );

    // Filter commissionServices when selectedMovement changes
    useEffect(() => {
        if (!movementId && commissionServices) {
            setFilteredCommissionServices(commissionServices); // Show all if no movementId
        }
    }, [movementId, commissionServices]);
    
    return (
        <div className="explore-commission-services">
            <RenderComissionServices commissionServices={commissionServices} />
            <Outlet />
        </div>
    )
}
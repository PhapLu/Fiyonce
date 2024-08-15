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

    const fetchRecommendedCommissionServices = async () => {
        try {
            let endpoint;
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
            const response = await apiUtils.get(endpoint);
            let commissionServices = response.data.metadata.commissionServices;
            console.log(commissionServices)

            return commissionServices;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const { data: commissionServices, error: fetchingCommissionServices, isError: isFetchingCommissionServicesError, isLoading: isFetchingCommissionServicesLoading } = useQuery(
        ['fetchRecommendedCommissionServices', selectedRecommender],
        fetchRecommendedCommissionServices,
        {
            onSuccess: (data) => {
                setFilteredCommissionServices(data);
            },
            onError: (error) => {
                console.error('Error fetching commissionServices:', error);
            },
        }
    );

    // Filter commissionServices when selectedMovement changes
    useEffect(() => {
        if (selectedMovement && commissionServices) {
            const filtered = commissionServices.filter(commissionServices => commissionServices?.movementId?._id === selectedMovement?._id);
            setFilteredCommissionServices(filtered);
        } else {
            setFilteredCommissionServices(commissionServices || []);
        }
    }, [selectedMovement, commissionServices]);


    return (
        <div className="explore-commission-services">
            <RenderComissionServices commissionServices={commissionServices} />
            <Outlet />
        </div>
    )
}
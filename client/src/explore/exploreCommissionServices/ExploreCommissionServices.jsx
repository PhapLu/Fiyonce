// Imports
import { useState, useEffect, useRef } from "react";
import { useOutletContext, useParams, useNavigate, Link, useLocation, Outlet, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import InfiniteScroll from 'react-infinite-scroll-component';

// Components
import RenderComissionServices from "../../components/crudCommissionService/render/RenderCommissionServices.jsx"

// Utils
import { apiUtils } from "../../utils/newRequest.js";

export default function ExploreCommissionServices() {
    const [searchParams] = useSearchParams();
    const { selectedRecommender, selectedMovement } = useOutletContext(); // Add this to use the context
    const [filteredCommissionServices, setFilteredCommissionServices] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const movementId = searchParams.get('movementId');

    // Fetch commission service categories and pass this prop to children component
    const { "commission-service-id": commissionServiceId } = useParams();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (commissionServiceId) {
            queryClient.invalidateQueries(['fetchCommissionService']); // Refetch when commissionServiceId changes
        }
    }, [commissionServiceId, queryClient]);


    const fetchCommissionService = async () => {
        try {
            const response = await apiUtils.get(`/commissionService/readCommissionService/${commissionServiceId}`);
            console.log(response.data.metadata.commissionService)
            return response.data.metadata.commissionService || {};
        } catch (error) {
            return null;
        }
    }
    const { data: commissionService, fetchingCommissionServiceError, isFetchingCommissionServiceError, isFetchingCommissionServiceLoading } = useQuery(
        ['fetchCommissionService', commissionServiceId], // Add commissionServiceId as a dependency
        () => fetchCommissionService(),
        {
            enabled: !!commissionServiceId, // Only fetch when commissionServiceId is available
            onSuccess: (data) => {
                // Handle success
            },
            onError: (error) => {
                console.error('Error fetching commission service by ID:', error);
            },
        }
    );

    const fetchRecommendedCommissionServices = async (page = 1) => {
        try {
            let endpoint;
            const movementId = searchParams.get('movementId');
            console.log(movementId)
            switch (selectedRecommender.algorithm) {
                case "following":
                    endpoint = `/recommender/readFollowingCommissionServices?page=${page}&limit=10`;
                    break;
                case "latest":
                    endpoint = `/recommender/readLatestCommissionServices?page=${page}&limit=10`;
                    break;
                case "popular":
                default:
                    endpoint = `/recommender/readPopularCommissionServices?page=${page}&limit=10`;
                    break;
            }

            // Append the movementId query parameter if it exists
            if (movementId) {
                endpoint += `&movementId=${movementId}`;
            }

            const response = await apiUtils.get(endpoint);
            const commissionServices = response?.data.metadata?.commissionServices || [];
            
            console.log(endpoint)
            console.log(commissionServices)

            return commissionServices;
        } catch (error) {
            console.error("Error fetching commission services:", error);
            return [];
        }
    };

    // Fetch more commission services as the user scrolls
    const fetchMoreCommissionServices = async () => {
        const nextPage = page + 1;
        const newCommissionServices = await fetchRecommendedCommissionServices(nextPage);
        if (newCommissionServices.length > 0) {
            setFilteredCommissionServices((prevCommissionServices) => [...prevCommissionServices, ...newCommissionServices]);
            setPage(nextPage);
        } else {
            setHasMore(false); // No more commission services to load
        }
    };

    useEffect(() => {
        const loadInitialCommissionServices = async () => {
            const initialCommissionServices = await fetchRecommendedCommissionServices(1);
            setFilteredCommissionServices(initialCommissionServices);
            setPage(1);
            setHasMore(initialCommissionServices.length > 0);
        };

        loadInitialCommissionServices();
    }, [selectedRecommender, searchParams]);


    const { data: commissionServices, error, isError, isLoading } = useQuery(
        ['fetchRecommendedCommissionServices', selectedRecommender, movementId],
        fetchRecommendedCommissionServices,
        {
            onSuccess: (data) => setFilteredCommissionServices(data),
            onError: (error) => console.error('Error fetching commissionServices:', error),
        }
    );

    // Filter commissionServices when selectedMovement changes
    // useEffect(() => {
    //     if (!movementId && commissionServices) {
    //         setFilteredCommissionServices(commissionServices); // Show all if no movementId
    //     }
    // }, [movementId, commissionServices]);

    return (
        <div className="explore-commission-services">
            <InfiniteScroll
                dataLength={filteredCommissionServices.length}
                next={fetchMoreCommissionServices}
                hasMore={hasMore}
            >
                <RenderComissionServices commissionServices={commissionServices} />
            </InfiniteScroll>
            <Outlet context={{ commissionService }} />
        </div>
    )
}
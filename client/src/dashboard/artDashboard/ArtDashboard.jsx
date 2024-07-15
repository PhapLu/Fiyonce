import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiUtils } from '../../utils/newRequest';
import CreateMovement from "../../components/crudMovement/create/CreateMovement";
import UpdateMovement from "../../components/crudMovement/update/UpdateMovement";
import DeleteMovement from "../../components/crudMovement/delete/DeleteMovement";

export default function ArtDashboard() {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [showCreateMovementForm, setShowCreateMovementForm] = useState(false);
    const [showUpdateMovementForm, setShowUpdateMovementForm] = useState(false);
    const [showDeleteMovementForm, setShowDeleteMovementForm] = useState(false);
    const [selectedMovement, setSelectedMovement] = useState(null);

    const queryClient = useQueryClient();

    const fetchMovements = async () => {
        try {
            const response = await apiUtils.get("/movement/readMovements");
            return response.data.metadata.movements;
        } catch (error) {
            return null;
        }
    };

    const { data: movements, isError, error, isLoading } = useQuery('movements', fetchMovements);

    const createMovementMutation = useMutation(
        (newMovement) => apiUtils.post("/movement/createMovement", newMovement),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('movements');
                setOverlayVisible(false);
                setShowCreateMovementForm(false);
            }
        }
    );

    const updateMovementMutation = useMutation(
        (movement) => apiUtils.patch(`/movement/updateMovement/${movement._id}`, movement),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('movements');
                setOverlayVisible(false);
                setShowCreateMovementForm(false);
            }
        }
    );

    const deleteMovementMutation = useMutation(
        (movement) => apiUtils.delete(`/movement/deleteMovement/${movement._id}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('movements');
                setOverlayVisible(false);
                setShowCreateMovementForm(false);
            }
        }
    );

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const handleUpdate = (movement) => {
        setSelectedMovement(movement);
        setShowUpdateMovementForm(true);
        setOverlayVisible(true);
    };

    const handleDelete = (movement) => {
        setSelectedMovement(movement);
        setShowDeleteMovementForm(true);
        setOverlayVisible(true);
    };

    return (
        <>
            <div className="dashboard-account">
                <section className="section overview">
                    <div className="section-header">
                        <div className="section-header--left">
                            <h3 className="section-header__title">Trường phái</h3>
                            <svg onClick={() => { setShowCreateMovementForm(true), setOverlayVisible(true) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 btn add-btn">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Trường phái</th>
                                <th>SL tác phẩm</th>
                                <th>SL dịch vụ</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements?.length > 0 ? (
                                movements.map((movement, index) => (
                                    <tr key={movement._id}>
                                        <td>{index + 1}</td>
                                        <td>{movement.title}</td>
                                        <td>{movement.artworkCount}</td>
                                        <td>{movement.commissionServiceCount}</td>
                                        <td>
                                            <button className="btn btn-2" onClick={() => handleUpdate(movement)}>Chỉnh sửa</button>
                                            <button className="btn btn-3" onClick={() => handleDelete(movement)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </div>
            {overlayVisible && (
                <div className="overlay">
                    {showCreateMovementForm && (
                        <CreateMovement
                            setShowCreateMovementForm={setShowCreateMovementForm}
                            createMovementMutation={createMovementMutation}
                            setOverlayVisible={setOverlayVisible}
                        />
                    )}
                    {showUpdateMovementForm && selectedMovement && (
                        <UpdateMovement
                            setShowUpdateMovementForm={setShowUpdateMovementForm}
                            setOverlayVisible={setOverlayVisible}
                            movement={selectedMovement}
                            updateMovementMutation={updateMovementMutation}
                        />
                    )}
                    {showDeleteMovementForm && selectedMovement && (
                        <DeleteMovement
                            setShowDeleteMovementForm={setShowDeleteMovementForm}
                            setOverlayVisible={setOverlayVisible}
                            movement={selectedMovement}
                            deleteMovementMutation={deleteMovementMutation}
                        />
                    )}
                </div>
            )}
        </>
    );
}
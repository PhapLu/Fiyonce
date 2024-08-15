// Imports
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';

// Components
import CreateChallenge from '../../components/crudChallenge/create/CreateChallenge.jsx';
// import UpdateChallenge from '../../components/crudChallenge/update/UpdateChallenge.jsx';
// import DeleteChallenge from '../../components/crudChallenge/delete/DeleteChallenge.jsx';


// Contexts
import { useModal } from "../../contexts/modal/ModalContext.jsx";

// Utils
import { apiUtils } from '../../utils/newRequest';

// Styling
import "./ChallengeDashboard.scss";
import { isFilled } from '../../utils/validator';
import { limitString } from '../../utils/formatter.js';

export default function ChallengeDashboard() {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [showCreateChallenge, setShowCreateChallenge] = useState(false);
    const [showUpdateChallenge, setShowUpdateChallenge] = useState(false);
    const [showDeleteChallenge, setShowDeleteChallenge] = useState(false);
    const [challenge, setChallenge] = useState(null);

    const queryClient = useQueryClient();
    const [isSubmitCreateChallengeLoading, setIsSubmitCreateChallengeLoading] = useState(false);
    const { setModalInfo } = useModal();

    const fetchChallenges = async () => {
        try {
            const response = await apiUtils.get("/challenge/readChallenges");
            console.log(response);
            return response.data.metadata.challenges;
        } catch (error) {
            return null;
        }
    };

    const { data: challenges, isError, error, isLoading } = useQuery('fetchChallenges', fetchChallenges);
    const createChallengeMutation = useMutation(
        (newChallenge) => apiUtils.post("/challenge/createChallenge", newChallenge),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchChallenges');
                setOverlayVisible(false);
                setShowCreateChallenge(false);
                setModalInfo({
                    status: "success",
                    message: "Tạo bản tin thành công"
                })
            }
        }
    );

    const updateChallengeMutation = useMutation(
        (updatedChallenge) => apiUtils.patch(`/challenge/updateChallenge/${updatedChallenge.get("_id")}`, updatedChallenge),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchChallenges');
                setOverlayVisible(false);
                setShowUpdateChallenge(false);
                setModalInfo({
                    status: "success",
                    message: "Cập nhật bản tin thành công"
                })
            }
        }
    );

    const deleteChallengeMutation = useMutation(
        (challengeId) => apiUtils.delete(`/challenge/deleteChallenge/${challengeId}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchChallenges');
                setOverlayVisible(false);
                setShowDeleteChallenge(false);
                setModalInfo({
                    status: "success",
                    message: "Xóa bản tin thành công"
                })
            }
        }
    );


    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <>
            <div className="dashboard-account">
                <section className="section overview">
                    <div className="section-header">
                        <div className="section-header--left">
                            <h3 className="section-header__title">Bản tin</h3>
                            <svg onClick={() => { setOverlayVisible(true); setShowCreateChallenge(true) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 btn add-btn">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>STT</th>
                                <th>Tiêu đề</th>
                                <th>Lượt xem</th>
                                <th>Cập nhật lúc</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                challenges?.length > 0 ? (
                                    challenges.map((challenge, index) => (
                                        <tr key={challenge._id}>
                                            <td><img src={challenge.thumbnail} alt="" /></td>
                                            <td>{index + 1}</td>
                                            <td><span className='fw-bold'>{challenge.title}</span>
                                                <br />{limitString(challenge.subTitle, 50)} </td>
                                            <td>{challenge.views}</td>
                                            <td>{challenge.updatedAt}</td>
                                            <td>
                                                <button className="btn btn-2" onClick={() => { setChallenge(challenge); setOverlayVisible(true); setShowUpdateChallenge(true) }}>Chỉnh sửa</button>
                                                <button className="btn btn-3" onClick={() => { setChallenge(challenge); setOverlayVisible(true); setShowDeleteChallenge(true) }}>Xóa</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className='text-align-center pt-16 pb-16'>Không có dữ liệu</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </section >
            </div >
            {overlayVisible && (
                <div className="overlay">
                    {showCreateChallenge && <CreateChallenge challenge={challenge} setShowCreateChallenge={setShowCreateChallenge} setOverlayVisible={setOverlayVisible} createChallengeMutation={createChallengeMutation} />}
                    {/* {showUpdateChallenge && <UpdateChallenge challenge={challenge} setShowUpdateChallenge={setShowUpdateChallenge} setOverlayVisible={setOverlayVisible} updateChallengeMutation={updateChallengeMutation} />}
                    {showDeleteChallenge && <DeleteChallenge challenge={challenge} setShowDeleteChallenge={setShowDeleteChallenge} setOverlayVisible={setOverlayVisible} deleteChallengeMutation={deleteChallengeMutation} />} */}
                </div>
            )}

        </>
    );
}
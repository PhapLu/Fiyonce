// Imports
import { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { ClipLoader } from 'react-spinners';

// Styling
import "./RenderChallenges.scss"
import { apiUtils } from "../../../utils/newRequest";
import { formatDatetime, limitString } from "../../../utils/formatter";

export default function RenderChallenges() {
    // Fetch challenges
    const fetchChallenges = async () => {
        try {
            const response = await apiUtils.get(`/challenge/readChallenges`);
            console.log(response.data.metadata.challenges)
            return response.data.metadata.challenges;
        } catch (error) {
            console.log(error)
            return null;
        }
    }
    const [happeningChallenges, setHappeningChallenges] = useState([]);
    const [pastChallenges, setPastChallenges] = useState([]);

    const { data: challenges, error, isError, isLoading } = useQuery(
        ['fetchChallenges'],
        fetchChallenges,
        {
            onSuccess: (data) => {
                setHappeningChallenges(data.filter((challenge) => new Date(challenge.endDate) >= Date.now()));
                setPastChallenges(data.filter((challenge) => new Date(challenge.endDate) < Date.now()));
            },
            onError: (error) => {
                console.error('Error fetching challenges:', error);
            },
        }
    );


    if (isLoading) {
        return (<div className="text-align-center flex-align-center flex-justify-center mt-40">
            <br />
            <ClipLoader className="clip-loader" size={40} loading={true} />
            <h3 className="ml-12">
                Đang tải
            </h3>
        </div>);
    }

    return (
        <div className="render-challenges">
            {/* Happening challenges */}
            {happeningChallenges?.length > 0 && (
                < section className="challenge__happening mt-32" >
                    <h2 className="text-align-center">Đang diễn ra</h2>
                    <hr />

                    <div className="challenge-container">
                        {happeningChallenges?.map((challenge, index) => {
                            return <div className="challenge-item" key={index}>
                                <div className="challenge-item--left">
                                    <img src={challenge?.thumbnail} alt={challenge?.title} className="challenge-item__thumbnail" />
                                </div>

                                <div className="challenge-item--right">
                                    <h3 className="challenge-item__title">{challenge?.title}</h3>
                                    <br />
                                    <span>{formatDatetime(challenge.startDate)} - {formatDatetime(challenge.startDate)}</span>
                                    <br />
                                    <br />
                                    <span dangerouslySetInnerHTML={{ __html: limitString(challenge.description, 250) }}></span>
                                    <br />
                                    <br />
                                    <Link to={`/challenges/${challenge._id}`} className="btn btn-md btn-2 mr-8">Tham gia ngay</Link>
                                    <Link to={`/challenges/${challenge._id}/details`} className="btn btn-md btn-3">Thể lệ cuộc thi</Link>
                                </div>
                            </div>
                        })}
                    </div>
                </section >
            )
            }


            {/* Past challenges */}
            {
                pastChallenges?.length > 0 && (
                    < section className="challenge__past mt-32" >
                        <h2 className="text-align-center">Đã diễn ra</h2>
                        {/* <hr /> */}

                        <div className="challenge-container">
                            {pastChallenges?.map((challenge, index) => {
                                return <div className="challenge-item" key={index}>
                                    <div className="challenge-item--left">
                                        <img src={challenge?.thumbnail} alt={challenge?.title} className="challenge-item__thumbnail" />
                                    </div>

                                    <div className="challenge-item--right">
                                        <h3 className="challenge-item__title">{challenge?.title}</h3>
                                        <br />
                                        <span>{formatDate(challenge.startAt)} - {formatDate(challenge.endAt)}</span>
                                        <br />
                                        <br />
                                        <span>{limitString(challenge.description, 150)}</span>
                                        <br />
                                        <br />
                                        <Link to={`/challenges/${challenge._id}`} className="btn btn-md btn-2 mr-8">Tham gia ngay</Link>
                                        <Link to={`/challenges/${challenge._id}/details`} className="btn btn-md btn-3">Thể lệ cuộc thi</Link>
                                    </div>
                                </div>
                            })}
                        </div>
                    </section >
                )
            }
        </div >
    )
}
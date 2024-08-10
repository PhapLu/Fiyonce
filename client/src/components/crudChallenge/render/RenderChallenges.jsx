// Imports
import { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

// Styling
import "./RenderChallenges.scss"
import { apiUtils } from "../../../utils/newRequest";
import { formatDate, limitString } from "../../../utils/formatter";

export default function RenderChallenges() {
    // Fetch challenges
    const fetchChallenges = async () => {
        try {
            const response = await apiUtils.get(`/challenge/readChallenges`);
            // console.log(response.data.metadata.challenges)
            // return response.data.metadata.challenges;
            return [{
                _id: "1",
                title: "Summer Art Challenge",
                description: "Unleash your creativity this summer with our exciting art challenge. Open to all skill levels.",
                thumbnail: "https://i.pinimg.com/564x/85/3a/4c/853a4c9d2bb5cc11b327c0e247a5d40d.jpg",
                startDate: "2024-08-15",
                endDate: "2024-09-15",
                prizes: "Top 3 winners will receive art supplies worth $500.",
                rules: "1. All submissions must be original.\n2. One entry per participant.\n3. Art should align with the summer theme.",
                status: "upcoming",
                participants: [], // Add participant IDs here
            },
            {
                _id: "2",
                title: "Portrait Mastery Challenge",
                description: "Master the art of portrait drawing with this focused challenge.",
                thumbnail: "https://i.pinimg.com/564x/85/3a/4c/853a4c9d2bb5cc11b327c0e247a5d40d.jpg",
                startDate: "2024-07-01",
                endDate: "2024-07-31",
                prizes: "The winner will get a $1000 cash prize and a feature in our newsletter.",
                rules: "1. Only portrait drawings are allowed.\n2. Submit in high-resolution format.\n3. Must be a new creation made during the challenge period.",
                status: "completed",
                participants: ["64cf8b9f3e74891234567891", "64cf8b9f3e74891234567892"],
            },
            {
                _id: "3",
                title: "Digital Art Competition",
                description: "Showcase your digital art skills in this global competition.",
                thumbnail: "https://i.pinimg.com/564x/85/3a/4c/853a4c9d2bb5cc11b327c0e247a5d40d.jpg",
                startDate: "2024-08-10",
                endDate: "2024-08-30",
                prizes: "The top 5 entries will receive a $300 Amazon gift card each.",
                rules: "1. Open to digital art only.\n2. Artwork should be no larger than 10MB.\n3. Submit your work in .PNG or .JPEG format.",
                status: "ongoing",
                participants: ["64cf8b9f3e74891234567893", "64cf8b9f3e74891234567894", "64cf8b9f3e74891234567895"],
            }]
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
                setHappeningChallenges(challenges.filter((challenge) => new Date(challenge.endDate) >= Date.now()))
                setPastChallenges(challenges.filter((challenge) => new Date(challenge.endDate) < Date.now()))
            },
            onError: (error) => {
                console.error('Error fetching service by ID:', error);
            },
        }
    );

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
            )}


            {/* Past challenges */}
            {pastChallenges?.length > 0 && (
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
            )}
        </div>
    )
}
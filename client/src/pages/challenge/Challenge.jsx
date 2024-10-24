
// Styling
import "./Challenge.scss";
import ChallengeBackground from "/uploads/challenge_background.png"

// Components
import RenderChallenges from "../../components/crudChallenge/render/RenderChallenges.jsx"
export default function Challenge() {

    // Fetch all challenges
    return (
        // Landing section
        <div className="challenge">
            <section className="challenge__landing">
                <div className="challenge__landing--left">
                    <h1>CHALLENGE, LEARN, & GROWTH</h1>
                    <hr />
                    <h3>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</h3>
                    <div className="challenge__landing__statistic-container">
                        <div className="challenge__landing__statistic-item">
                            <h2>24+</h2>
                            <h3>Chủ đề</h3>
                        </div>
                        <hr className="vertical-hr" />
                        <div className="challenge__landing__statistic-item">
                            <h2>746+</h2>
                            <h3>Tác phẩm</h3>
                        </div>
                        <hr className="vertical-hr" />
                        <div className="challenge__landing__statistic-item">
                            <h2>80Tr+</h2>
                            <h3>VND</h3>
                        </div>
                    </div>
                </div>

                <div className="challenge__landing--right">
                    <img src={ChallengeBackground} className="challenge__landing__bg" alt="Placeholder" />
                </div>
            </section>

            <RenderChallenges />
        </div>
    )
}
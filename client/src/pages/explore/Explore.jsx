// Imports
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Resources
import News from "../../components/news/News.jsx";
import Artworks from "../../components/artworks/Artworks";
import Talents from "../../components/talents/Talents";
import CommissionServices from "../../components/commissionServices/CommissionServices";

// Styling
import "./Explore.scss";

export default function Explore({ showArtworks = false, showTalents = false, showCommisisionServices = false }) {

    return (
        <div className="explore">
            {/* Display informative news */}
            <News />

            {/* Sub navigation bar of the page */}
            <div className="subnav-container">
                <Link className={`subnav-item btn ${location.pathname.includes('/explore/artworks') ? "active" : ""}`} to="/explore/artworks"
                >
                    Tranh vẽ
                </Link>
                <Link className={`subnav-item btn ${location.pathname.includes('/explore/talents') ? "active" : ""}`} to="/explore/talents"
                >
                    Họa sĩ
                </Link>
                <Link className={`subnav-item btn ${location.pathname.includes('/explore/commissionServices') ? "active" : ""}`} to="/explore/commissionServices">
                    Dịch vụ
                </Link>
                <hr />
            </div>

            <div className="explore__filter-container">
                <div className="explore__filter-item btn btn-3 btn-md">
                    Bộ lọc
                </div>

                <div className="explore__filter-item flex-align-center">
                    <img src="https://i.pinimg.com/736x/65/89/71/65897136ccdaed22a789f0a097d8cca6.jpg" alt="" />
                    <div className="explore__filter-item__details">
                        <span className="explore__filter-item__details__title">Tranh truyền thần</span>
                        <br />
                        <span className="explore__fitler-item__details__statistics">5.2K+</span>
                    </div>
                </div>
            </div>
            {
                showArtworks && <Artworks />
            }

            {
                showTalents && <Talents />
            }

            {
                showCommisisionServices && <CommissionServices />
            }

        </div>
    )
}
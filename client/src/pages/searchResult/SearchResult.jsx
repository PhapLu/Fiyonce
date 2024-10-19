import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { apiUtils } from '../../utils/newRequest';
import RenderCommissionServices from '../../components/crudCommissionService/render/RenderCommissionServices.jsx';
import "./SearchResult.scss";
import RenderUsers from '../../components/crudUser/render/RenderUsers.jsx';

export default function SearchResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q') || '';
  const contentType = queryParams.get('type') || '';

  const [userResults, setUserResults] = useState([]);
  const [serviceResults, setServiceResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchResults = async (term) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiUtils.get('/recommender/readSearchResults', {
        params: { searchTerm: term },
      });

      setUserResults(response.data.metadata.userResults);
      setServiceResults(response.data.metadata.serviceResults);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchSearchResults(searchTerm);
    }
  }, [searchTerm]);

  const handleContentTypeChange = (type) => {
    if (type) {
      queryParams.set('type', type);
    } else {
      queryParams.delete('type'); // Remove the type parameter if it's empty
    }
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  if (!searchTerm) {
    return <div className="search-message">Please enter a search term.</div>;
  }

  if (error) {
    return <div className="search-message error">Error: {error}</div>;
  }

  return (
    <div className="search-results-page">
      <h2 className='text-align-center'>Kết quả tìm kiếm cho "{searchTerm}"</h2>

      <div className="sub-nav-container flex-justify-center">
        <div className={`sub-nav-item btn btn-md br-16 mr-8 ${contentType === "" ? "active" : ""}`} onClick={() => handleContentTypeChange("")}>Họa sĩ ({userResults?.length})</div>
        <div className={`sub-nav-item btn btn-md br-16 mr-8 ${contentType === "service" ? "active" : ""}`} onClick={() => handleContentTypeChange("service")}>Dịch vụ ({serviceResults?.length})</div>
      </div>
      <hr className='mb-32' />

      {
        contentType === "service" ? (
          <section className="search-section">
            {serviceResults.length > 0 ? (
              <RenderCommissionServices commissionServices={serviceResults} />
            ) : (
              <p className='text-align-center'>Không tìm thấy kết quả tìm kiếm cho từ khóa "{searchTerm}"</p>
            )}
          </section>
        ) : (
          <section className="search-section">
            {userResults.length > 0 ? (
              <RenderUsers users={userResults} />
            ) : (
              <p className='text-align-center'>Không tìm thấy kết quả tìm kiếm cho từ khóa "{searchTerm}"</p>
            )}
            {/* {userResults.length > 0 ? (
              <ul className="results-list">
                {userResults.map((user) => (
                  <li key={user._id} className="result-item">
                    <div className="user-card">
                      <h3>{user.fullName}</h3>
                      {user.stageName && <p><strong>Stage Name:</strong> {user.stageName}</p>}
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Bio:</strong> {user.bio}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-align-center'>Không tìm thấy kết quả tìm kiếm cho từ khóa "{searchTerm}"</p>
            )} */}
          </section>
        )
      }
      <Outlet />
    </div >
  );
}
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { apiUtils } from '../../utils/newRequest';

const SOCKET_SERVER_URL = "http://localhost:8900"; // Update this with your server URL

const TalentRequestListener = () => {
    const [talentRequests, setTalentRequests] = useState([]);

    useEffect(() => {
        // Fetch existing talent requests from the API
        apiUtils.get('/talentRequest/viewTalentRequests')
            .then(response => {
                console.log('API Response:', response.data); // Log the API response
                if (response.data && response.data.metadata && response.data.metadata.talentRequests) {
                    setTalentRequests(response.data.metadata.talentRequests);
                } else {
                    console.log('No talent requests found in the response.');
                }
            })
            .catch(error => {
                console.error('Error fetching talent requests:', error);
            });

        const socket = io(SOCKET_SERVER_URL, {
            withCredentials: true
        });

        socket.on('connect', () => {
            console.log('Connected to socket server:', socket.id);

            // Add user to socket (for demonstration, assuming userId is 1)
            socket.emit('addUser', "6662c4f8a0fe5944a1ea33cc");
        });

        socket.on('getTalentRequest', (data) => {
            console.log('Received talent request:', data);
            setTalentRequests((prevRequests) => {
                if (data && data.talentRequest) {
                    return [...prevRequests, data.talentRequest];
                } else {
                    console.warn('Received malformed talent request:', data);
                    return prevRequests;
                }
            });
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h2>Talent Requests</h2>
            {talentRequests.length > 0 ? (
                <ul>
                    {talentRequests.map((request, index) => (
                        <li key={index}>
                            <p><strong>Status:</strong> {request.status}</p>
                            <p><strong>Request ID:</strong> {request._id}</p>
                            <p><strong>User ID:</strong> {request.userId}</p>
                            <p><strong>Stage name:</strong> {request.stageName}</p>
                            <p><strong>Portfolio Link:</strong> {request.portfolioLink}</p>
                            <p><strong>Request at:</strong> {request.createdAt}</p>
                            {request.artworks && request.artworks.length > 0 ? (
                                request.artworks.map((artwork, index) => (
                                    <img key={index} style={{ width: "100px", height: "100px", marginRight: "10px" }} src={artwork} alt="" />
                                ))
                            ) : (
                                <p>No artworks uploaded</p>
                            )}
                            <br />
                            <br />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No talent requests received yet.</p>
            )}
        </div>
    );
};

export default TalentRequestListener;
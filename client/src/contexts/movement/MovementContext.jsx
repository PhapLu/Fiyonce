import {useQuery} from 'react-query';
import { createContext, useState, useContext, useEffect } from 'react';

const MovementContext = createContext();

export const useMovement = () => {
    return useContext(MovementContext);
};

export const MovementProvider = ({ children }) => {
    const fetchMovements = async () => {
        try {
            const response = await newRequest.get('movements/readMovements');
            console.log(response)
            return response.data.metadata.movements;
        } catch (error) {
            // console.log(error.response)
            return null;
        }
    };

    const { data: movements, error, isError, isLoading } = useQuery('fetchMovements', fetchMovements, {
        onError: (error) => {
            console.error('Error fetching movements:', error);
        },
    });

    if (isLoading) {
        return <span>Đang tải...</span>
    }

    if (isError) {
        return <span>Have an errors: {error.message}</span>
    }


    const value = {
        movements
    };

    return (
        <MovementContext.Provider value={value}>
            {children}
        </MovementContext.Provider>
    );
};
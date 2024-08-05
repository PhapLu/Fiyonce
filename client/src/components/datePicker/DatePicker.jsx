import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';

const DatePicker = ({ value, onChange }) => {
    const currentYear = new Date().getFullYear();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    const monthRef = useRef(null);
    const yearRef = useRef(null);

    useEffect(() => {
        if (value) {
            const date = new Date(value);
            const day = date.getUTCDate();
            const month = date.getUTCMonth() + 1;
            const year = date.getUTCFullYear();
            setSelectedDate({ value: day, label: String(day).padStart(2, '0') });
            setSelectedMonth({ value: month, label: new Date(2000, month - 1).toLocaleString('vi-VN', { month: 'long' }) });
            setSelectedYear({ value: year, label: year });
        }
    }, [value]);

    const updateSelectedDate = (day, month, year) => {
        if (day && month && year) {
            const formattedDate = `${String(year)}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00.000Z`;
            onChange(formattedDate);
        }
    };

    const handleDateChange = (selectedOption) => {
        setSelectedDate(selectedOption);
        updateSelectedDate(selectedOption.value, selectedMonth?.value, selectedYear?.value);
    };

    const handleMonthChange = (selectedOption) => {
        setSelectedMonth(selectedOption);
        updateSelectedDate(selectedDate?.value, selectedOption.value, selectedYear?.value);
    };

    const handleYearChange = (selectedOption) => {
        setSelectedYear(selectedOption);
        updateSelectedDate(selectedDate?.value, selectedMonth?.value, selectedOption.value);
    };

    const handleDateInput = (inputValue) => {
        const parsedValue = parseInt(inputValue, 10);
        if (parsedValue >= 1 && parsedValue <= 31) {
            const selectedOption = { value: parsedValue, label: String(parsedValue).padStart(2, '0') };
            handleDateChange(selectedOption);
            if (inputValue.length === 2) {
                monthRef.current.focus();
            }
        }
    };

    const handleMonthInput = (inputValue) => {
        const parsedValue = parseInt(inputValue, 10);
        if (parsedValue >= 1 && parsedValue <= 12) {
            const selectedOption = { value: parsedValue, label: new Date(2000, parsedValue - 1).toLocaleString('vi-VN', { month: 'long' }) };
            handleMonthChange(selectedOption);
            if (inputValue.length === 2) {
                yearRef.current.focus();
            }
        }
    };

    const handleYearInput = (inputValue) => {
        const parsedValue = parseInt(inputValue, 10);
        if (parsedValue >= 1900 && parsedValue <= currentYear) {
            const selectedOption = { value: parsedValue, label: parsedValue };
            handleYearChange(selectedOption);
        }
    };

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter') {
            nextRef.current.focus();
        }
    };

    const dateOptions = Array.from({ length: 31 }, (_, i) => ({
        value: i + 1,
        label: String(i + 1).padStart(2, '0')
    }));

    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(2000, i).toLocaleString('vi-VN', { month: 'long' })
    }));

    const yearOptions = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => ({
        value: currentYear - i,
        label: currentYear - i
    }));

    return (
        <div className="date-picker flex-align-center">
            <span className='mr-8'>
                <Select
                    value={selectedDate}
                    onChange={handleDateChange}
                    options={dateOptions}
                    placeholder="Chọn"
                    formatOptionLabel={({ label }) => label}
                    onInputChange={handleDateInput}
                    onKeyDown={(e) => handleKeyDown(e, monthRef)}
                />
            </span>

            <span className='mr-8'>
                <Select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    options={monthOptions}
                    placeholder="Chọn"
                    formatOptionLabel={({ label }) => label}
                    onInputChange={handleMonthInput}
                    ref={monthRef}
                    onKeyDown={(e) => handleKeyDown(e, yearRef)}
                />
            </span>
            <span className='mr-8'>
                <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    options={yearOptions}
                    placeholder="Chọn"
                    formatOptionLabel={({ label }) => label}
                    onInputChange={handleYearInput}
                    ref={yearRef}
                />
            </span>
        </div>
    );
};

export default DatePicker;
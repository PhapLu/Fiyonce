// Imports
import {useRef, useState} from "react";
import { Link } from "react-router-dom";

// Styling


export default function CreateProposal({ setShowCreateProposal, setOverlayVisible }) {
    return (
        <div className="create-proposal modal-form type-2">
            <Link to="/help_center" className="form__help" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg> Trợ giúp
            </Link>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowCreateProposal(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <div className="modal-form--left">

            </div>
            <div className="modal-form--right">
                <h2 className="form__title">Soạn hợp đồng</h2>

                <div className="form-field">
                    <label htmlFor="title" className="form-field__label">Tiêu đề</label>
                </div>
            </div>
        </div>
    )
}
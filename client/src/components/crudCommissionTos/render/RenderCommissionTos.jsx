import { useState, useEffect, useRef } from "react";
import "./RenderCommissionTos.scss";

export default function CommissionTos({ setShowCreateCommissionTosForm , setShowCommissionTosView, setOverlayVisible }) {
    const [commissionTos, setCommissionTos] = useState([
        { id: '1', title: "Quản lí điều khoản dịch vụ", time: "2021-01-01" },
        { id: '2', title: "Quản lí điều khoản dịch vụ", time: "2021-01-01" },
        { id: '3', title: "Quản lí điều khoản dịch vụ", time: "2021-01-01" },
        { id: '4', title: "Quản lí điều khoản dịch vụ", time: "2021-01-01" },
    ]);
    const [editingTos, setEditingTos] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);

    // Toggle display modal form
    const ManageCommissionTosViewRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (ManageCommissionTosViewRef.current && !ManageCommissionTosViewRef.current.contains(e.target)) {
                setShowCommissionTosView(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [setShowCommissionTosView, setOverlayVisible]);

    const handleEditClick = (tos) => {
        setEditingTos(tos);
        setShowEditForm(true);
    };

    const handleEditFormClose = () => {
        setEditingTos(null);
        setShowEditForm(false);
    };

    const handleEditFormSave = (updatedTos) => {
        setCommissionTos((prevTos) => 
            prevTos.map((tos) => (tos.id === updatedTos.id ? updatedTos : tos))
        );
        handleEditFormClose();
    };

    return (
        <div className="commission-tos modal-form type-3" ref={ManageCommissionTosViewRef} onClick={(e) => { e.stopPropagation() }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowCommissionTosView(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="form__title">Quản lí điều khoản dịch vụ</h2>
            <ul className="commission-tos-container">
                {commissionTos.map((tos) => (
                    <li className="commission-tos-item" key={tos.id}>
                        <p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 edit-tos-ic" onClick={() => handleEditClick(tos)}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 delete-tos-ic">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>

                            <strong>{tos.title}</strong>
                            <br />
                            <i>Cập nhật vào {tos.time}</i>
                            <br />
                            <span>Áp dụng cho các dịch vụ: Service 01, Service 02, Service 03.</span>
                            <br />
                            <span>Đã áp dụng cho: 16 đơn hàng.</span>
                        </p>
                    </li>
                ))}
            </ul>
            <div className="form-field">
                <button type="submit" className="form-field__input btn btn-2 btn-md" onClick={() => { setShowCreateCommissionTosForm(true); setShowCommissionTosView(false) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Thêm điều khoản
                </button>
            </div>
            {showEditForm && (
                <EditTosForm tos={editingTos} onClose={handleEditFormClose} onSave={handleEditFormSave} />
            )}
        </div>
    );
}
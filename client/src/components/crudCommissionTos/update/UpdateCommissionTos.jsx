import { useState } from "react";

export default function EditTosForm({ tos, onClose, onSave }) {
    const [title, setTitle] = useState(tos.title);
    const [time, setTime] = useState(tos.time);

    const handleSave = () => {
        onSave({ ...tos, title, time });
    };

    return (
        <div className="edit-tos-form">
            <h2>Edit ToS</h2>
            <div>
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <label>Time</label>
                <input type="date" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div>
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default EditTosForm;

// Imports


export default function LinkWorkQueue() {
    const [inputs, setInputs] = useState();
    const [error, setError] = useState();

    return (
        <div className="overlay">
            <div className="link-work-queue modal-form type-3">
                <h2 className="form__title">Liên kết To-do list</h2>
                <div className="form-field">
                    <label htmlFor="" className="form-field__label"></label>
                    <input type="text" name="workQueue" className="form-field__input" />
                </div>
            </div>
        </div>
    )
}

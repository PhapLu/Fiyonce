import React, { useRef } from "react";

function FileInput({ onImageSelected }) {
  const inputRef = useRef();

  // Handle the change event when a file is selected
  const handleOnChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = function (e) {
        onImageSelected(reader.result);
      };
    }
  };

  const onChooseImg = () => {
    inputRef.current.click();
  };

  return (
    <div>
      {/* Hidden file input element */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleOnChange}
        style={{ display: "none" }}
      />

      {/* Button to trigger the file input dialog */}
      <button className="btn" onClick={onChooseImg}>
        Choose Image
      </button>
    </div>
  );
}

export default FileInput;
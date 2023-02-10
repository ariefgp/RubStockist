// frontend/src/components/OpenModalButton/index.js
import React from 'react';
import { useModal } from '../../context/Modal';

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  faIcon, // optional: font awesome icon to render inside the button
  disabled = false, // optional: boolean to disable the button
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (typeof onButtonClick === 'function') onButtonClick();
    if (typeof onModalClose === 'function') setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return (
    faIcon ? 
      <button onClick={onClick} disabled={disabled}><i className={`${faIcon}`}></i></button>
      :
      <button onClick={onClick} disabled={disabled}>{buttonText}</button>
  );
}

export default OpenModalButton;
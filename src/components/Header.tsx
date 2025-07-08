import React from 'react';
import logo from '../logo.svg';

interface HeaderProps {
  setShowSettingsModal: (show: boolean) => void;
}

function Header({ setShowSettingsModal }: HeaderProps) {
  return (
    <header className="row-auto d-flex justify-content-center align-items-center position-relative">
      <div className="d-flex align-items-center">
        <img src={logo} alt="Requst Logo" style={{ height: '60px', marginRight: '15px' }} />
        <h1 className="my-3" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Requst</h1>
      </div>
      <button className="btn btn-link text-decoration-none position-absolute" style={{ right: '20px' }} onClick={() => setShowSettingsModal(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.17.31a1.464 1.464 0 0 1-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.31-.17a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.17-.31a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.31.17a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 0 0-5.86 2.929 2.929 0 0 0 0 5.858z"/>
        </svg>
      </button>
    </header>
  );
}

export default Header;

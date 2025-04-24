import React from 'react';
import './Header.scss';

const Header = () => {
  return (
    <header className="container-fluid text-center py-4 header">
      <h1 className='name'>AI Stock Whisper</h1>
      <p className='second-text'>AI-Powered Stock Analysis & Predictions</p>
    </header>
  );
};

export default Header;
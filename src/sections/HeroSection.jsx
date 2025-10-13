import React from 'react';
import AxiomLogo from "../assets/Axiom_Wordmark.svg"
import AxiomLogoFinal from "../assets/Axiom_Wordmark_Final.png"
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div>
      <div className="hero">
        <img src={AxiomLogoFinal} alt="Axiom logo" className='hero-logo' />
      </div>
    </div>
  );
};

export default HeroSection;

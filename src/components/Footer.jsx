import React from 'react';
import '../styles/fragments.css';

const Footer = () => {
    return (
        <footer className="footer" role="contentinfo">
            <div className="footer-content">
                <p>&copy; 2025 <strong>Total Soft Inc.</strong> | Todos los derechos reservados.</p>
                <div className="social-icons">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <img src="/images/facebook.png" alt="Facebook" />
                    </a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <img src="/images/twitter.png" alt="Twitter" />
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <img src="/images/instagram.png" alt="Instagram" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

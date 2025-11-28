import React, { useState, useRef } from 'react';
import styles from './Chatbox.module.css';

const Chatbox = () => {
  const [isHovered, setIsHovered] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const phoneNumber = '1800-6969'; // Replace with actual phone number
  const zaloAccount = 'BaoAnMedicine'; // Replace with actual Zalo account

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300); // Delay hiding by 300ms
  };

  return (
    <div
      className={styles['chatbox-container']}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Chatbox contact info"
    >
      <div
        className={styles['chatbox-button']}
        role="button"
        tabIndex={0}
        aria-pressed={isHovered}
        onKeyPress={(e) => {
          if (e.key === 'Enter') setIsHovered(!isHovered);
        }}
      >
        <svg
          className={styles['chatbox-icon']}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M20 2H4C2.9 2 2 2.89 2 4v16l4-4h14c1.11 0 2-.9 2-2V4c0-1.11-.89-2-2-2zm-2 9h-8v-2h8v2zm0-3h-8V6h8v2z" />
        </svg>
      </div>
      {isHovered && (
        <div
          className={styles['chatbox-info']}
          role="tooltip"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div>
            <strong>Phone:</strong>{' '}
            <a href={`tel:${phoneNumber}`} className={styles['chatbox-link']} aria-label={`Call ${phoneNumber}`}>
              {phoneNumber}
            </a>
          </div>
          <div>
            <strong>Zalo:</strong>{' '}
            <a
              href={`https://zalo.me/${zaloAccount}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['chatbox-link']}
              aria-label={`Chat via Zalo account ${zaloAccount}`}
            >
              {zaloAccount}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbox;

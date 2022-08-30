import React from "react";
import "./InfoBox.scss";

/**
 * Box for information user should be aware of
 *
 * @property {string} children - text to be displayed in box
 */
const InfoBox = ({ children }) => {
  return (
    <div className="ddsdocs-info-box">
      <span className="ddsdocs-info-box__icon">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 7.5H13V9.5H11V7.5ZM11 11.5H13V17.5H11V11.5ZM12 2.5C6.48 2.5 2 6.98 2 12.5C2 18.02 6.48 22.5 12 22.5C17.52 22.5 22 18.02 22 12.5C22 6.98 17.52 2.5 12 2.5ZM12 20.5C7.59 20.5 4 16.91 4 12.5C4 8.09 7.59 4.5 12 4.5C16.41 4.5 20 8.09 20 12.5C20 16.91 16.41 20.5 12 20.5Z" />
        </svg>
      </span>
      <span className="ddsdocs-info-box__text">{children}</span>
    </div>
  );
};

export default InfoBox;

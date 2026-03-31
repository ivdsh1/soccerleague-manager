
import React from 'react';

const LogoDisplay = ({ team, style, className }) => {
    // This component now always displays the emoji, ignoring the 'style' prop,
    // to ensure a consistent look as requested.
    return (
        React.createElement("span", { className: className || 'text-xl' }, team.emoji || '❓')
    );
};

export default LogoDisplay;

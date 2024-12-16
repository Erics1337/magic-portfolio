import React from 'react';

const ScrollIndicator: React.FC = () => {
    return (
        <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full relative flex justify-center">
                <div className="w-1 h-2 bg-white rounded-full absolute top-2 animate-scroll" />
            </div>
        </div>
    );
};

export default ScrollIndicator;

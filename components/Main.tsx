import React from 'react';

const Main = () => {
    return (
        <main className="flex flex-col h-screen overflow-y-auto">
            <div className="flex-1 flex items-center justify-center bg-gray-200 border">
                Home Section
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-300 border">
                About Section
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-400 border">
                Services Section
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-500 border">
                Contact Section
            </div>
        </main>
    );
};

export default Main;

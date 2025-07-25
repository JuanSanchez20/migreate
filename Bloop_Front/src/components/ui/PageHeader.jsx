import React from 'react';

const PageHeader = ({ title, description, icon: IconComponent }) => {
    return (
        <div className="mb-1.5">
            <div className="flex items-center space-x-2 mb-4 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-r from-[#278bbd] to-[#48d1c1] 
                                rounded-lg flex items-center justify-center">
                    {IconComponent ? (
                        <IconComponent className="w-5 h-5 text-white" />
                    ) : (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    )}
                </div>
                <div className='flex-1 min-w-0'>
                    <h1 className="font-bold text-white text-lg md:text-2xl">
                        {title}
                    </h1>
                    <p className="text-slate-400 hidden md:block text-xs">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
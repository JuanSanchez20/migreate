import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

// Ávatar del usuario
const UserAvatar = ({ user, className = "" }) => (
    <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-[#278bbd]/20 to-[#48d1c1]/20 
                    flex items-center justify-center flex-shrink-0 border-2 border-[#278bbd]/30
                    group-hover:border-[#278bbd]/50 transition-all duration-300 ${className}`}>
        <UserIcon className="h-8 w-8 text-[#278bbd] group-hover:text-[#48d1c1] transition-colors duration-300" />
    </div>
);

export default UserAvatar;
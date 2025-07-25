import React from "react";
import UserCard from '../UserCard';

const UsersGrid = ({ users, onCardClick, loading }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
            <UserCard
                key={user.u_id}
                user={user}
                onCardClick={onCardClick}
                disabled={loading}
            />
        ))}
    </div>
);

export default UsersGrid;
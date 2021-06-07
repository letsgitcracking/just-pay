import React, { useEffect } from 'react';

const Logout = ({ handleisLoggedIn }) => {
    useEffect(() => {
        handleisLoggedIn(false);
    }, [handleisLoggedIn]);

    return <div>Logout</div>;
};

export default Logout;
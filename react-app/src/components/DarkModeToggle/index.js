import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserDarkModePref, getUserSession } from '../../store/session';
import Darkreader, { Switch, useDarkreader } from 'react-darkreader';

const DarkModeToggle = () => {
    const [isDark, { toggle }] = useDarkreader(false, {
        brightness: 150,
        contrast: 100,
        sepia: 0,
        },
        {
            ignoreImageAnalysis: ['.background-image', '.background-image-2', '.login-page-splash-image-container']
        }
    );

    const dispatch = useDispatch();

    const user = useSelector(state => state.session.user);
    const dark_mode_pref = user?.dark_mode_pref;

    useEffect(() => {
        // dispatch(getUserSession())
        
        if(dark_mode_pref === true && !isDark) {
            toggle();
            dispatch(getUserSession())
        }
        if(dark_mode_pref === false && isDark) {
            toggle();
            dispatch(getUserSession())
        }
    }, []);

    const handleClick = async () => {
        await toggle();
        await dispatch(updateUserDarkModePref(!isDark))
    };

    // const [message, setMessage] = useState('Current theme mode is what');

    return (
        <>
            <Switch
                checked={isDark}
                onChange={() => {
                    handleClick()
                }}
                styling="github"
            />
            {/* <Darkreader
                defaultDarken
                theme={{
                    brightness: 100,
                    contrast: 95,
                    sepia: 0,
                }}
                styling="github"
                onChange={isDark =>
                    setMessage(`Current theme mode is ${isDark ? '🌜' : '🌞'}`)
                }
            /> */}
        </>
    )
};

export default DarkModeToggle;
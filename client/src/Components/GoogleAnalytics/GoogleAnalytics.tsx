import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { useLocation } from 'react-router-dom';
import config from '../../config';

const GoogleAnalytics: React.FC = () => {
    const [previous, setPrevious] = useState<{
        pathname: string,
        search: string
    }>();
    const location = useLocation();

    const logPageChange = (pathname: string, search: string = '') => {
        const page = pathname + search;
        const { location } = window;
        ReactGA.set({
            page,
            location: `${location.origin}${page}`,
        });
        ReactGA.pageview(page);
        setPrevious({
            pathname,
            search
        });
    }

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            ReactGA.initialize(config.GA_TRACKING_ID);
        }
    }, [])

    useEffect(() => {
        if (previous === undefined || (previous!.pathname !== location.pathname || previous!.search !== location.search)) {
            logPageChange(
                location.pathname,
                location.search
            );
        }
    }, [location])

    return null;
}

export default GoogleAnalytics;
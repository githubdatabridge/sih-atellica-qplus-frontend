import { useEffect, useState } from "react";

// url is the API endpoint you are polling
// delay is the interval between polls in milliseconds
const useQlikResizePolling = (qlik, delay = 5000) => {
    const [timestamp, setTimestamp] = useState<number>(0);

    const qlikResizingHelper = async _qlik => {
        await _qlik.resize();
        const newTimestamp = new Date().getMilliseconds();
        setTimestamp(newTimestamp);
    };

    useEffect(() => {
        const intervalId = setInterval(() => qlikResizingHelper(qlik), delay); // Subsequent polls every 'delay' milliseconds

        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, [qlik, delay]);

    return { timestamp };
};

export default useQlikResizePolling;

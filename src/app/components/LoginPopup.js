"use client"
import { useEffect, useState } from 'react';

const LoginPopup = ({ message }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
        const timer = setTimeout(() => setShow(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded shadow-md w-3/4 max-w-lg">
                <span className="text-gray-600 float-right text-2xl cursor-pointer" onClick={() => setShow(false)}>&times;</span>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default LoginPopup;

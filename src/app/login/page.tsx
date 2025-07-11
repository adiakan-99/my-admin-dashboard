"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { FeedbackContext } from '@/context/FeedbackContext';

const LoginPage = () => {
    const [useremail, setUseremail] = React.useState<string>("");
    const [userpassword, setUserpassword] = React.useState<string>("");
    const { feedback, setFeedback } = React.useContext(FeedbackContext);
    const router = useRouter();

    React.useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

        if (isAuthenticated) {
            router.push("/dashboard");
        }
    }, []);

    React.useEffect(() => {
        if (feedback.message) {
            const timer = setTimeout(() => setFeedback({ message: "", type: "" }), 3000);

            return () => clearTimeout(timer);
        }
    }, [feedback.message])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(useremail, userpassword);
        if (useremail === User.email && userpassword === User.password) {
            localStorage.setItem("isAuthenticated", "true");
            redirect('/dashboard');
        } else {
            setFeedback({
                message: "Invalid email or password",
                type: "error"
            });
        }
    }

    return (
        <div>
            <div className='flex justify-content justify-center items-center min-h-screen bg-gray-100'>
                <form onSubmit={handleSubmit} method="post" className='bg-white p-8 rounded lg shadow-md w-full max-w-md'>
                    <div className='text-blue-700 text-2xl text-center mt-4 mb-4'>
                        Login
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2' htmlFor="useremail">Email</label>
                    </div>
                    <div className='mb-4'>
                        <input onChange={(e) => setUseremail(e.target.value)} value={useremail} className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700' type="email" name="useremail" id="useremail" />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2' htmlFor="userpassword">Password</label>
                    </div>
                    <div className='mb-4'>
                        <input onChange={(e) => setUserpassword(e.target.value)} value={userpassword} className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700' type="password" name="userpassword" id="userpassword" />
                    </div>
                    <button className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200' type="submit">Login</button>
                    {
                        feedback.type === "error" &&
                        <div className='mt-4 text-red-500 text-center'>
                            {feedback.message}
                        </div>
                    }
                </form>
            </div>
        </div>
    )
};

export default LoginPage;
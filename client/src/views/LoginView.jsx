import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginView = ({ setAuth }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify({ id: res.data._id, email: res.data.email, role: res.data.role }));
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`; // Set auth header immediately
            setAuth({ isAuthenticated: true, user: res.data });
            navigate('/dashboard'); // Redirect to dashboard after login
        } catch (err) {
            setError(err.response?.data?.message || t('login_failed'));
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Section: Logo and Address */}
            <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center p-8">
                <div className="text-gray-800 text-center">
                    <img src="/esagym.jpg" alt="Esa Gym Logo" className="w-32 h-32 mx-auto mb-6" />
                    <h1 className="text-5xl font-extrabold mb-2">Esa Gym</h1>
                    <p className="text-xl font-light text-gray-600">Jalan Kp Cijeungjing No 101</p>
                </div>
            </div>

            {/* Right Section: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
                    {/* Mobile-only branding */}
                    <div className="flex flex-col items-center mb-6 lg:hidden">
                        <img src="/esagym.jpg" alt="Esa Gym Logo" className="w-24 h-24 mb-4" />
                        <h1 className="text-3xl font-bold text-gray-800">Esa Gym</h1>
                        <p className="text-sm text-gray-500">Jalan Kp Cijeungjing No 101</p>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">{t('login')}</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            {t('email')}
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm w-full text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            {t('password')}
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm w-full text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                        >
                            {t('login')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    );
};

export default LoginView;

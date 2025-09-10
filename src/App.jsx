import { Routes, Route, Link } from 'react-router-dom';
import PostCreatePage from './pages/PostCreatePage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import RegisterPage from './pages/RegisterPage';
import PollCreatePage from './pages/PollCreatePage';
import { useEffect } from 'react';
import { createIcons, Home, Edit, User, Shield, BarChart2, UserPlus } from 'lucide';

const App = () => {
    useEffect(() => {
        createIcons({ icons: { Home, Edit, User, Shield, BarChart2, UserPlus } });
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-900">
            <aside className="fixed top-0 left-0 h-full w-64 bg-slate-800/50 backdrop-blur-sm text-white p-6 space-y-6">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Kamu Portal" className="w-10 h-10" />
                    <h1 className="text-2xl font-bold">Kamu Portal</h1>
                </div>
                <nav className="space-y-2">
                    <Link to="/" className="nav-link flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700/50">
                        <i data-lucide="home"></i> Ana Sayfa
                    </Link>
                    <Link to="/create-post" className="nav-link flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700/50">
                        <i data-lucide="edit"></i> Gönderi Oluştur
                    </Link>
                    <Link to="/profile" className="nav-link flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700/50">
                        <i data-lucide="user"></i> Profil
                    </Link>
                    <Link to="/admin" className="nav-link flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700/50">
                        <i data-lucide="shield"></i> Admin Paneli
                    </Link>
                    <Link to="/poll-create" className="nav-link flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700/50">
                        <i data-lucide="bar-chart-2"></i> Anket Oluştur
                    </Link>
                    <Link to="/register" className="nav-link flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700/50">
                        <i data-lucide="user-plus"></i> Kayıt Ol
                    </Link>
                </nav>
            </aside>
            <main className="ml-64 flex-1 p-4">
                <Routes>
                    <Route path="/" element={<div className="text-white">Ana Sayfa (WIP)</div>} />
                    <Route path="/create-post" element={<PostCreatePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/poll-create" element={<PollCreatePage />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;

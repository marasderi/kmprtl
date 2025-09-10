import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await fetch(`/api/users?limit=20`);
        const data = await response.json();
        setUsers(data);
    };

    const handleSearch = async () => {
        const response = await fetch(`/api/search?query=${searchQuery}`);
        const data = await response.json();
        setUsers(data.hits.map(hit => hit._source));
    };

    const handleBanUser = async (userId) => {
        await fetch(`/api/users/${userId}/ban`, { method: 'POST' });
        fetchUsers();
    };

    return (
        <div className="main-page-content p-4 md:p-8 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                <i data-lucide="shield" className="text-indigo-400"></i> Admin Paneli
            </h2>
            <div className="bg-slate-800/70 p-6 rounded-xl glass-effect">
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Kullanıcı Ara"
                        className="w-full bg-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                    >
                        <i data-lucide="search" className="inline mr-2"></i> Ara
                    </button>
                </div>
                <div className="space-y-4">
                    {users.map(user => (
                        <div key={user.id} className="flex items-center justify-between bg-slate-700/50 p-4 rounded-lg">
                            <div className="flex items-center gap-4">
                                <img src={user.avatar || '/default-avatar.png'} alt="Avatar" className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="text-white font-semibold">{user.username}</p>
                                    <p className="text-slate-400 text-sm">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleBanUser(user.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                            >
                                <i data-lucide="ban" className="inline mr-2"></i> Engelle
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;

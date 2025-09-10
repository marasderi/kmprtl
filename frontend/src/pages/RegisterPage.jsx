import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '', bio: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                navigate('/login');
            } else {
                alert(data.detail);
            }
        } catch (error) {
            alert('Error registering user');
        }
    };

    return (
        <div className="main-page-content p-4 md:p-8 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                <i data-lucide="user-plus" className="text-indigo-400"></i> Kayıt Ol
            </h2>
            <div className="bg-slate-800/70 p-6 rounded-xl glass-effect">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Kullanıcı Adı"
                        className="w-full bg-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-400"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="E-posta"
                        className="w-full bg-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-400"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Şifre"
                        className="w-full bg-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-400"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Biyografi (isteğe bağlı)"
                        className="w-full bg-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-400"
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    ></textarea>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg"
                    >
                        <i data-lucide="user-plus" className="inline mr-2"></i> Kayıt Ol
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;

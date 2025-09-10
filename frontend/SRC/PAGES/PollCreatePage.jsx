import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PollCreatePage = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('/api/polls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, options })
        });
        navigate('/profile');
    };

    return (
        <div className="main-page-content p-4 md:p-8 space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                <i data-lucide="bar-chart-2" className="text-indigo-400"></i> Anket Oluştur
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Anket Sorusu"
                    className="w-full bg-slate-700/50 rounded-lg px-4 py-2 text-white"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                {options.map((opt, index) => (
                    <input
                        key={index}
                        type="text"
                        placeholder={`Seçenek ${index + 1}`}
                        className="w-full bg-slate-700/50 rounded-lg px-4 py-2 text-white"
                        value={opt}
                        onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[index] = e.target.value;
                            setOptions(newOptions);
                        }}
                    />
                ))}
                <button
                    type="button"
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg"
                    onClick={() => setOptions([...options, ''])}
                >
                    Seçenek Ekle
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                >
                    Anket Oluştur
                </button>
            </form>
        </div>
    );
};
export default PollCreatePage;

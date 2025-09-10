import EmojiPicker from 'emoji-picker-react';

const PostCreatePage = () => {
    const [content, setContent] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    return (
        <div className="main-page-content p-4 md:p-8 space-y-6">
            <textarea
                className="w-full bg-slate-700/50 rounded-lg px-4 py-3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <i data-lucide="smile"></i>
            </button>
            {showEmojiPicker && (
                <EmojiPicker onEmojiClick={(emoji) => setContent(content + emoji.emoji)} />
            )}
        </div>
    );
};

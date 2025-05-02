import axios from "axios"
import { Appbar } from "../components/Appbar"
import { BE_URL } from "../config"
import { ChangeEvent, useState } from "react"
import { useNavigate } from "react-router-dom"

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert("Please enter a title for your post");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await axios.post(`${BE_URL}/api/v1/blog`, {
                title,
                content: desc
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            navigate(`/blog/${response.data.id}`);
        } catch (error) {
            console.error("Error publishing post:", error);
            alert("Failed to publish post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar />
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 md:px-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Post</h1>
                        
                        {/* Title Input */}
                        <div className="mb-6">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                                focus:border-blue-500 transition-colors text-gray-900"
                                placeholder="Enter a captivating title..."
                            />
                        </div>
                        
                        {/* Text Editor */}
                        <div className="mb-6">
                            <label htmlFor="editor" className="block text-sm font-medium text-gray-700 mb-2">
                                Content
                            </label>
                            <TextEditor onChange={(e) => setDesc(e.target.value)} />
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center justify-between mt-6">
                            <button
                                onClick={() => navigate(-1)}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-full 
                                hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`px-6 py-3 text-sm font-medium text-white bg-green-700 rounded-full 
                                focus:ring-4 focus:ring-blue-300 transition-colors flex items-center
                                ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-green-800'}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Publishing...
                                    </>
                                ) : "Publish Post"}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Preview Section (optional) */}
                {(title || desc) && (
                    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">Preview</h2>
                            <div className="border-t pt-4">
                                <h3 className="text-xl font-bold mb-4">{title || "Untitled Post"}</h3>
                                <div className="prose max-w-none">
                                    {desc ? (
                                        <div className="whitespace-pre-wrap">{desc}</div>
                                    ) : (
                                        <p className="text-gray-500 italic">Your content will appear here...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

function TextEditor({ onChange }: { onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) {
    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Optional Toolbar */}
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 flex items-center space-x-4">
                <button className="p-1 hover:bg-gray-200 rounded" title="Bold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8m-8 6h8m-8-12h8" />
                    </svg>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded" title="Italic">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded" title="Insert Image">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded" title="Insert Link">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </button>
            </div>
            
            {/* Text Area */}
            <textarea
                id="editor"
                onChange={onChange}
                rows={12}
                className="block w-full p-4 text-gray-800 focus:outline-none focus:ring-0 border-0"
                placeholder="Write an amazing article..."
            />
            
            {/* Optional Footer */}
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-t border-gray-300 flex justify-between">
                <span>Markdown supported</span>
                <span>Drag images to upload</span>
            </div>
        </div>
    );
}
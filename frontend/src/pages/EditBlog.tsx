import axios from "axios";
import { Appbar } from "../components/Appbar";
import { BE_URL } from "../config";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../components/Spinner";

export const EditBlog = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${BE_URL}/api/v1/blog/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                setTitle(response.data.blog.title);
                setDesc(response.data.blog.content);
            } catch (error) {
                console.error("Error fetching blog:", error);
                alert("Failed to load blog post.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleUpdate = async () => {
        if (!title.trim()) {
            alert("Title cannot be empty.");
            return;
        }

        try {
            setIsSubmitting(true);
            await axios.put(`${BE_URL}/api/v1/blog/${id}`, {
                title,
                content: desc,
                id: Number(id)
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });

            navigate(`/blog/${id}`);
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (<Spinner/>);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar />
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 md:px-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Blog Post</h1>

                        <div className="mb-6">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                                focus:border-blue-500 transition-colors text-gray-900"
                                placeholder="Enter a title..."
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="editor" className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                            <TextEditor onChange={(e) => setDesc(e.target.value)} value={desc} />
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <button
                                onClick={() => navigate(-1)}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-full 
                                hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
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
                                        Updating...
                                    </>
                                ) : "Update Post"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function TextEditor({
    onChange,
    value
}: {
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    value: string;
}) {
    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 flex items-center space-x-4">
                {/* toolbar buttons */}
            </div>
            <textarea
                id="editor"
                value={value}
                onChange={onChange}
                rows={12}
                className="block w-full p-4 text-gray-800 focus:outline-none focus:ring-0 border-0"
                placeholder="Edit your article..."
            />
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-t border-gray-300 flex justify-between">
                <span>Markdown supported</span>
                <span>Drag images to upload</span>
            </div>
        </div>
    );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddToolPage = () => {
    const navigate = useNavigate();
    const [currentTag, setCurrentTag] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        category: string;
        url: string;
        features: string[];
        tags: string[];
    }>({
        name: "",
        description: "",
        category: "Chatbot",
        url: "",
        features: [],
        tags: [],
    });

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const categories = [
        "Chatbot",
        "Image",
        "Writing",
        "Video",
        "Code",
        "Design",
        "Audio",
        "Other"
    ];

    const popularTags = [
        "ai",
        "free",
        "paid",
        "open-source",
        "web",
        "api",
        "automation",
        "creative",
        "productivity",
        "enterprise",
    ];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategorySelect = (category: string) => {
        setFormData((prev) => ({ ...prev, category }));
    };


    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && currentTag.trim()) {
            e.preventDefault();
            const tag = currentTag.trim().toLowerCase();

            if (!formData.tags.includes(tag)) {
                setFormData((prev) => ({
                    ...prev,
                    tags: [...prev.tags, tag],
                }));
            }
            setCurrentTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const addPopularTag = (tag: string) => {
        if (!formData.tags.includes(tag)) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tag],
            }));
        }
    };

    // ✅ Create new tool
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        // Get user data from localStorage, fallback to anonymous
        let authorName = "anonymous";
        let authorEmail = "anonymous@example.com";
        let userJob = "developer";

        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                authorName = user.name || "anonymous";
                authorEmail = user.email || "anonymous@example.com";
                userJob = user.job || "developer";
            } catch (parseErr) {
                console.error("Could not parse user data, using anonymous", parseErr);
            }
        } else {
            console.error("No user data in localStorage, using anonymous");
        }

        const toolPayload = {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            url: formData.url,
            features: formData.features,
            tags: formData.tags,
            author: {
                name: authorName,
                email: authorEmail,
                job: userJob,
            },
        };

        try {
            const res = await fetch(`${API_URL}/api/tools/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token || ""}`
                },
                body: JSON.stringify(toolPayload)
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to submit tool");
            } else {
                setSuccess("AI Tool created successfully!");
                setTimeout(() => {
                    navigate("/profile");
                }, 1500);
                // Reset form
                setFormData({
                    name: "",
                    description: "",
                    category: "Chatbot",
                    url: "",
                    features: [],
                    tags: [],
                });
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "An error occurred";
            console.error("Submit error:", errorMsg);
            setError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Form Section */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Add New AI Tool
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Share an amazing AI tool with our community.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <p className="text-green-700 dark:text-green-300 font-medium">{success}</p>
                            </div>
                        )}

                        {/* Tool Name Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                                Tool Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., ChatGPT, Midjourney, Grammarly"
                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Description Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe what this tool does and its key features..."
                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                                required
                            />
                        </div>

                        {/* Category Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => handleCategorySelect(category)}
                                        className={`px-4 py-3 rounded-xl border-2 transition-all font-medium ${formData.category === category
                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-400'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* URL Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                                Tool URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                name="url"
                                value={formData.url}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Tags Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium rounded-full border border-red-200 dark:border-red-800"
                                    >
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-1 hover:text-red-900 dark:hover:text-red-100"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Type a tag and press Enter..."
                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            />

                            {/* Popular Tags */}
                            <div className="mt-3">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Popular tags:</p>
                                <div className="flex flex-wrap gap-2">
                                    {popularTags.map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => addPopularTag(tag)}
                                            disabled={formData.tags.includes(tag)}
                                            className={`px-3 py-1 text-xs rounded-full border transition-all ${formData.tags.includes(tag)
                                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                                                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-red-400 hover:text-red-600 dark:hover:text-red-400'
                                                }`}
                                        >
                                            + {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.name || !formData.description || !formData.url}
                                className="flex-1 px-8 py-4 bg-linear-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg shadow-red-600/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isSubmitting ? "Publishing..." : "Publish Tool"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/profile")}
                                className="px-8 py-4 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddToolPage;
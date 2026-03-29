import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

interface AITool {
  _id?: string;
  name: string;
  description: string;
  category: string;
  url: string;
  features?: string[];
  tags?: string[];
  userId: string;
  likes?: number;
  views?: number;
  author: {
    name: string;
    email: string;
  };
}

export default function EditTool() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [tool, setTool] = useState<AITool | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Chatbot");
  const [url, setUrl] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://16.170.172.53:5000";
  const token = localStorage.getItem("token");

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

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Check if tool data was passed via location state
    if (location.state?.tool) {
      const toolData = location.state.tool;
      setTool(toolData);
      setName(toolData.name || "");
      setDescription(toolData.description || "");
      setCategory(toolData.category || "Chatbot");
      setUrl(toolData.url || "");
      setFeatures(Array.isArray(toolData.features) ? toolData.features : []);
      setTags(Array.isArray(toolData.tags) ? toolData.tags.join(", ") : "");
      setLoading(false);
    } else if (id) {
      // Fetch tool from backend if not in state
      fetch(`${API_URL}/api/tools/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to load tool");
          return res.json();
        })
        .then(data => {
          setTool(data);
          setName(data.name || "");
          setDescription(data.description || "");
          setCategory(data.category || "Chatbot");
          setUrl(data.url || "");
          setFeatures(Array.isArray(data.features) ? data.features : []);
          setTags(Array.isArray(data.tags) ? data.tags.join(", ") : "");
          setLoading(false);
        })
        .catch(err => {
          setError(err instanceof Error ? err.message : "Failed to load tool");
          setLoading(false);
        });
    }
  }, [id, token, navigate, location.state, API_URL]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !tool?._id) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const tagsArray = tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const response = await fetch(`${API_URL}/api/tools/${tool._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          category,
          url: url.trim(),
          features,
          tags: tagsArray
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update tool");
      }

      setSuccess("Tool updated successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating tool");
    } finally {
      setSaving(false);
    }
  };

  const addFeature = (feature: string) => {
    if (feature.trim() && !features.includes(feature)) {
      setFeatures([...features, feature.trim()]);
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFeatures(features.filter(f => f !== featureToRemove));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <p className="text-gray-600 dark:text-gray-400">Loading tool...</p>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Tool not found</p>
          <button
            onClick={() => navigate("/profile")}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit AI Tool
          </h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-6">
          {/* Tool Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Tool Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., ChatGPT, Midjourney"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this AI tool"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
              required
            />
          </div>

          {/* Category & URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Tool URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Key Features
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-medium rounded-full border border-yellow-200 dark:border-yellow-800"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="ml-1 hover:text-yellow-900 dark:hover:text-yellow-100"
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
              placeholder="Type feature and press Enter or click add"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFeature(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., ai, free, productivity"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Updating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Tool
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

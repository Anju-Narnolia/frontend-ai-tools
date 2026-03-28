import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface User {
  _id?: string;
  name: string;
  email: string;
  job: string;
  createdAt?: string;
}
interface AITool {
  _id?: string;
  name: string;
  description: string;
  category: string;
  url: string;
  features?: string[];
  userId: string;
  likes?: number;
  views?: number;
  author: {
    name: string;
    email: string;
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showmore, setShowmore] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(`${API_URL}/api/users/me`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : "Error loading profile");
        setLoading(false);
      });

    // // Fetch all tools of current user
    fetch(`${API_URL}/api/tools/user/tools`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch tools");
        return res.json();
      })
      .then(data => {
        setTools(data);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : "Error loading tools");
      });
  }, [token, API_URL, navigate]);



  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleEditTool = (tool: AITool) => {
    navigate(`/edit-tool/${tool._id}`, { state: { tool } });
    setOpenMenuId(null);
  };

  const handleDeleteTool = async (toolId: string | undefined) => {
    if (!toolId) return;

    try {
      const response = await fetch(`${API_URL}/api/tools/${toolId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to delete tool");

      setTools(tools.filter(t => t._id !== toolId));
      setDeleteConfirmId(null);
      setOpenMenuId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting tool");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-center text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Profile
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your account and AI tools
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-800 transition-all duration-200 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>

        {user && (
          <div className="flex flex-col gap-10">
            {/* Main Profile Card */}

            <div className=" flex gap-10 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className=" flex justify-between items-end mb-6">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=256&bold=true`}
                  alt={user.name}
                  className="w-20 h-20 rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg object-cover bg-gray-100"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                  Account Details
                </h3>
                <div className="space-y-4 flex  gap-12">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
                      <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Full Name</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                      <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
                    </div>
                  </div>

                  {user.createdAt && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Member Since</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>


            {/* Recent Tools Section */}
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  My AI Tools
                </h3>
                {tools.length > 3 && (
                  <button onClick={() => {
                    setShowmore(true);
                  }}
                    className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium">
                    View All →
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                {(showmore ? tools : tools.slice(0, 3)).map((tool) => (
                  <div key={tool._id} className="group p-4 bg-gray-50 dark:bg-gray-700/50 flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-yellow-300 dark:hover:border-yellow-700 hover:shadow-md transition-all relative">
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === (tool._id || "") ? null : (tool._id || ""))}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 11-4 0 2 2 0 014 0zM10 12a2 2 0 11-4 0 2 2 0 014 0zM10 18a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                      {openMenuId === tool._id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                          <button
                            onClick={() => handleEditTool(tool)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm flex items-center gap-2 border-b border-gray-200 dark:border-gray-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(tool._id || null)}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    {deleteConfirmId === tool._id && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-20">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">Delete this tool?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteTool(tool._id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-4 h-4 rounded-full bg-linear-to-r from-yellow-600 to-red-600"></span>
                      <span className="text-md font-medium text-gray-600 dark:text-gray-400">{tool.category}</span>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                      {tool.name || "Untitled Tool"}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {tool.description || "No description provided."}
                    </p>
                    <Link to={tool.url} target="_blank" className=" flex items-center justify-center bg-linear-to-r from-yellow-600 to-red-600 text-white hover:underline mt-2 py-2 px-4 rounded-lg text-center">
                      Visit Tool
                    </Link>
                  </div>
                ))}
              </div>

              {showmore && (
                <div className="mt-4 flex justify-center">
                  <button onClick={() => { setShowmore(false); setOpenMenuId(null); }}
                    className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium">
                    Show Less ↑
                  </button>
                </div>
              )}

              {tools.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No tools yet. Start creating!</p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div >
  );
}
// import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Image as ImageIcon,
  PenTool,
  Video,
  ExternalLink,
  ArrowRight,
  Search,
  Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
interface Tool {
  name: string;
  description: string;
  category: string;
  url: string;
  color: string;
}


const BLOGS = [
  {
    id: 1,
    title: "The Future of AI in Creative Industries",
    excerpt: "How generative AI is reshaping design, video production, and digital art workflows.",
    date: "Mar 25, 2026"
  },
  {
    id: 2,
    title: "Top 10 AI Writing Assistants Compared",
    excerpt: "A deep dive into Grammarly, Jasper, Copy.ai and which tool fits your writing style.",
    date: "Mar 22, 2026"
  },
  {
    id: 3,
    title: "Building Applications with LLMs",
    excerpt: "Best practices for integrating large language models into your software products.",
    date: "Mar 18, 2026"
  }
];

const CATEGORIES = [
  { name: "All", icon: Sparkles },
  { name: "Chatbot", icon: MessageSquare },
  { name: "Image", icon: ImageIcon },
  { name: "Writing", icon: PenTool },
  { name: "Video", icon: Video },
];
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://16.170.172.53:5000';
        const res = await fetch(`${apiUrl}/api/tools/all`);
        const data = await res.json();
        setTools(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, tools]);


  return (
    <>
      <section id="/" className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="lg:col-span-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-100 text-yellow-700 font-medium text-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                New tools added weekly
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                Discover the Best <br className="hidden sm:block" />
                <span className="bg-clip-text text-transparent bg-linear-to-r from-yellow-600 to-red-600">
                  AI Tools
                </span> in One Place
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Explore, compare, and stay updated with the latest AI innovations.
                Find the perfect tool to supercharge your workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="#tools"
                  className="px-8 py-4 rounded-full bg-linear-to-r from-yellow-600 to-red-600 text-white font-bold text-lg shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Explore Tools <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#blogs"
                  className="px-8 py-4 rounded-full bg-white text-gray-700 border-2 border-gray-200 font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center"
                >
                  Read Blogs
                </a>
              </div>
            </div>
            {/* Visual/Illustration */}
            <div className="lg:col-span-6 mt-12 lg:mt-0 relative">
              <div className="relative rounded-2xl bg-linear-to-br from-yellow-50 to-red-50 p-2 shadow-2xl">
                <div className="absolute -inset-1 bg-linear-to-r from-yellow-600 to-red-600 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-white rounded-xl overflow-hidden aspect-4/3 flex items-center justify-center border border-gray-100">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
                  <div className="relative z-10 grid grid-cols-2 gap-4 p-8 w-full">
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                        <MessageSquare className="w-6 h-6 text-green-600" />
                      </div>2
                      <div className="h-2 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 transform rotate-2 translate-y-4 hover:rotate-0 hover:translate-y-0 transition-transform duration-300">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                        <ImageIcon className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="h-2 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                        <PenTool className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="h-2 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 transform -rotate-3 -translate-y-2 hover:rotate-0 hover:translate-y-0 transition-transform duration-300">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                        <Video className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="h-2 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* tool section */}
      <section id="tools" className="py-20 bg-linear-to-br from-yellow-50 to-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore AI Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our curated collection of the best artificial intelligence tools available today.
            </p>
          </div>
          <div className="mb-12 space-y-6">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-yellow-500 focus:ring-0 transition-all shadow-sm"
                placeholder="Search AI tools by name or feature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${isActive
                      ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/30 scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
          {tools.length === 0 ? (
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <div className="animate-spin inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                  <Sparkles className="w-8 h-8 text-yellow-600" />
                </div>
                <h2 className="text-lg font-medium text-gray-900">Loading tools...</h2>
                <p className="text-gray-500">Please wait while we fetch the latest AI tools for you.</p>
              </div>
            </div>
          ) :
            (filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTools.map((tool) => (
                  <div key={tool.name} className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${tool.color}`}>
                          {tool.category}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-yellow-600 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                    <div className="px-6 pb-6 pt-2">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 rounded-xl bg-gray-50 text-gray-900 font-semibold text-center hover:bg-yellow-600 hover:text-white transition-all duration-300"
                      >
                        Visit Tool
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No tools found</h3>
                <p className="text-gray-500">Try adjusting your search or category filter.</p>
              </div>
            ))}
        </div>
      </section>

      <section id="blogs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-br from-yellow-600 to-red-700 mb-4 pb-3">Featured Blogs</h2>
              <p className="text-gray-600 max-w-xl">
                Stay informed with the latest trends, tutorials, and insights from the world of artificial intelligence.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOGS.map((blog) => (
              <article className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-yellow-100 to-red-100 group-hover:scale-105 transition-transform duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PenTool className="w-12 h-12 text-gray-400/50" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-sm text-yellow-600 font-semibold mb-2">{blog.date}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center text-yellow-600 font-semibold text-sm group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </article >
            ))}
          </div>
        </div>
      </section>

      {/* cta section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-yellow-600 to-red-700"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stay Updated with AI Trends
          </h2>
          <p className="text-yellow-100 text-lg mb-10 max-w-2xl mx-auto">
            Join 10,000+ subscribers receiving weekly updates on new AI tools, industry news, and exclusive tutorials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto border-white border-2 rounded-full bg-white/20 backdrop-blur-sm px-1 py-1">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 flex-1"
            />
            <button className="px-8 py-4 rounded-full bg-white text-yellow-600 font-bold hover:bg-yellow-50 transition-colors shadow-lg">
              Subscribe
            </button>
          </div>
          <p className="text-yellow-200/60 text-sm mt-4">
            No spam, unsubscribe at any time.
          </p>
        </div>
      </section>
    </>
  );
};

import { Link, useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa6";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    return (<>
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="shrink-0 flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 bg-linear-to-br from-yellow-600 to-red-600 rounded-lg flex items-center justify-center">
                            <FaRobot className="w-5 h-5 text-white" />
                        </div>
                        <Link to="" className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-yellow-600 to-red-600">
                            AIToolHub
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <span
                            onClick={() => navigate("/", { state: { scrollTo: "home" } })}
                            className="cursor-pointer text-gray-600 hover:text-yellow-600 font-medium"
                        >
                            Home
                        </span>
                        <span
                            onClick={() => navigate("/", { state: { scrollTo: "tools" } })}
                            className="cursor-pointer text-gray-600 hover:text-yellow-600 font-medium"
                        >
                            Tools
                        </span>

                        <span
                            onClick={() => navigate("/", { state: { scrollTo: "blogs" } })}
                            className="cursor-pointer text-gray-600 hover:text-yellow-600 font-medium"
                        >
                            Blogs
                        </span>
                        {user && (
                            <>
                                <Link to="/add-tool">
                                    <button className="px-5 py-2 rounded-full border-2 border-yellow-600 text-yellow-600 font-medium hover:bg-yellow-600 hover:text-white transition-all transform hover:scale-105">
                                        Add Tool
                                    </button>
                                </Link>
                                <Link to="/profile">
                                    <button className="px-5 py-2 rounded-full bg-linear-to-r from-yellow-600 to-red-600 text-white font-medium hover:from-yellow-700 hover:to-red-700 transition-all transform hover:scale-105">
                                        Profile
                                    </button>
                                </Link>
                            </>
                        )}
                        {!user && (
                            <Link to="/login">
                                <button className="px-5 py-2 rounded-full bg-linear-to-r from-yellow-600 to-red-600 text-white font-medium hover:from-yellow-700 hover:to-red-700 transition-all transform hover:scale-105">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-gray-900 p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {['Home', 'Tools', 'Blogs'].map((item) => (
                            <a

                                href={`#${item.toLowerCase()}`}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-50"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <div className="pt-4">
                            <button className="w-full px-5 py-3 rounded-lg bg-linear-to-r from-yellow-600 to-red-600 text-white font-medium">
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    </>)
}
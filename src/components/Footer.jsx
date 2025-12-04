import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">TrendQuik</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your one-stop shop for the latest trends. We bring you high-quality products at unbeatable prices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-white transition-colors text-sm">Products</Link>
                            </li>
                            <li>
                                <Link to="/category" className="text-gray-400 hover:text-white transition-colors text-sm">Categories</Link>
                            </li>
                            <li>
                                <Link to="/wishlist" className="text-gray-400 hover:text-white transition-colors text-sm">Wishlist</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/orders" className="text-gray-400 hover:text-white transition-colors text-sm">My Orders</Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-gray-400 hover:text-white transition-colors text-sm">Cart</Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm">Sign In</Link>
                            </li>
                            <li>
                                <span className="text-gray-400 text-sm">Help Center</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors text-xl">
                                <FaTwitter />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors text-xl">
                                <FaFacebook />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors text-xl">
                                <FaInstagram />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors text-xl">
                                <FaYoutube />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-10 pt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} TrendQuik. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

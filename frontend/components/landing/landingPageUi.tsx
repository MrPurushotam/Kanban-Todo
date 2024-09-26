"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import ZoomableImage from './ZoomImage';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-4">Your Target List</h1>
        <p className="text-xl md:text-2xl text-gray-700">Organize your tasks, boost your productivity</p>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8 w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg w-full md:w-96"
        >
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Kanban Board View
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              List View
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Priority Setting
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Due Date Tracking
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-lg w-full md:w-96"
        >
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="mb-4">Sign in to organize your tasks in list or kanban view</p>
          <Link href="/login" className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
            Sign In
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            Don't have an account? <Link href="/login" className="text-blue-500 hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-12 w-full overflow-hidden mx-auto px-4 sm:px-6 lg:px-8"
      >
        <ZoomableImage
          src="/image.png"
          alt="TaskList Demo"
          width={600}
          height={300}
        />
      </motion.div>
    </div>
  );
   
};

export default LandingPage;
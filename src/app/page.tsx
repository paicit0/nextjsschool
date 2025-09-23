// npm run dev
"use client";

import {
  ArrowRightOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            {/* Main heading */}
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="block">School</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Management
              </span>
              <span className="block text-4xl md:text-5xl mt-4 text-gray-600">
                System
              </span>
            </h1>

            {/* Main navigation cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              {/* Students Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <Link href="/students">
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <UserOutlined style={{ fontSize: 32, color: "white" }} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Students
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Manage student information, with ease.
                    </p>
                    <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700 gap-2">
                      Manage Students
                      <ArrowRightOutlined />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Classrooms Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <Link href="/classrooms">
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <ScheduleOutlined
                        style={{ fontSize: 32, color: "white" }}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Classrooms
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Organize classrooms and classroom information.
                    </p>
                    <div className="flex items-center justify-center text-purple-600 font-semibold group-hover:text-purple-700 gap-2">
                      Manage Classrooms
                      <ArrowRightOutlined />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

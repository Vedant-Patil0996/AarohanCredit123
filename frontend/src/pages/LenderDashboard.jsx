// src/pages/LenderDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LenderSidebar from '../components/Lender/LenderSidebar'; 
import Header from '../components/Header';
import { Wallet, Activity, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

// --- Chart Data ---
const segmentData = [
    { name: 'Micro', value: 4500 },
    { name: 'Small', value: 3000 },
    { name: 'Medium', value: 2500 },
];
const COLORS = ['#4da3ff', '#2c7be5', '#1e40af']; // Neon blue shades

const trendData = [
    { name: 'Jan', HighRisk: 15, LowRisk: 40 },
    { name: 'Feb', HighRisk: 18, LowRisk: 35 },
    { name: 'Mar', HighRisk: 12, LowRisk: 42 },
    { name: 'Apr', HighRisk: 10, LowRisk: 45 },
    { name: 'May', HighRisk: 14, LowRisk: 38 },
    { name: 'Jun', HighRisk: 20, LowRisk: 30 },
];

// --- Chart Components ---
const SegmentPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
                {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#111217', 
                    border: '1px solid #4da3ff', 
                    borderRadius: '10px' 
                }} 
                labelStyle={{ color: '#fff' }}
                formatter={(value, name) => [`₹ ${value.toLocaleString()} Cr`, name]}
            />
            <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: '10px' }} />
        </PieChart>
    </ResponsiveContainer>
);

const RiskTrendLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#111217', 
                    border: '1px solid #4da3ff', 
                    borderRadius: '10px' 
                }} 
                labelStyle={{ color: '#fff' }}
                formatter={(value) => [`${value} Apps`, "Applications"]}
            />
            <Legend />
            <Line type="monotone" dataKey="HighRisk" stroke="#f87171" strokeWidth={2} name="High Risk Apps" />
            <Line type="monotone" dataKey="LowRisk" stroke="#4da3ff" strokeWidth={2} name="Low Risk Apps" />
        </LineChart>
    </ResponsiveContainer>
);

// Reusable Neon Card component
const StatCard = ({ title, value, icon: Icon, percentage, color }) => {
    const isPositive = percentage && parseFloat(percentage) >= 0;
    const percentageColor = isPositive ? 'text-[#4da3ff]' : 'text-[#f87171]';
    const percentageIcon = ArrowUpRight;

    return (
        <div className="p-5 rounded-xl border border-[#4da3ff]/50 shadow-[0_0_25px_#4da3ff]/50 bg-[#111217] hover:shadow-[0_0_35px_#4da3ff]/70 transition-all">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">{title}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center`} style={{ backgroundColor: color, color: '#fff' }}>
                    <Icon size={16} />
                </div>
            </div>
            <p className="text-3xl font-bold mt-2 text-white">{value}</p>
            {percentage && (
                <div className="flex items-center mt-3">
                    <span className={`text-xs font-semibold ${percentageColor} flex items-center`}>
                        <percentageIcon size={14} className="mr-1 transform rotate-45" />
                        {percentage}% vs last month
                    </span>
                </div>
            )}
        </div>
    );
};

// Recent Applications Table
const RecentApplicationsTable = () => {
    const applications = [
        { id: 'CRD781', msme: 'Vedant Empires', amount: '₹ 15 L', score: 780, status: 'Reviewing', date: '2025-11-27' },
        { id: 'CRD780', msme: 'Innovate Solutions', amount: '₹ 5 L', score: 650, status: 'Pending Data', date: '2025-11-26' },
        { id: 'CRD779', msme: 'Swift Logistics', amount: '₹ 25 L', score: 810, status: 'Approved', date: '2025-11-25' },
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Reviewing': return 'bg-yellow-500/30 text-yellow-400';
            case 'Pending Data': return 'bg-blue-500/30 text-blue-400';
            case 'Approved': return 'bg-emerald-500/30 text-emerald-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="bg-[#111217] p-6 rounded-xl border border-[#4da3ff]/50 shadow-[0_0_25px_#4da3ff]/40 mt-8">
            <h3 className="text-xl font-semibold mb-4 text-white">New Application Pipeline</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Application ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">MSME Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Requested Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">AI Score</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-900/40 transition-colors">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#4da3ff]">{app.id}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{app.msme}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{app.amount}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-300">{app.score}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{app.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Main Dashboard
export default function LenderDashboard() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user] = useState({ name: 'HDFC Bank Team', branch: 'Mumbai-HQ' }); 

    const dashboardContent = (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Portfolio Value" value="₹ 500 Cr" icon={Wallet} percentage="+3.2" color="#4da3ff" />
            <StatCard title="New Applications" value="45" icon={Activity} percentage="-12.5" color="#2c7be5" />
            <StatCard title="Approval Rate (30 Days)" value="88.4%" icon={CheckCircle} percentage="+1.1" color="#1e40af" />
            <StatCard title="Avg. Decision Time" value="12 hrs" icon={Clock} percentage="-20" color="#0ea5e9" />

            <div className="lg:col-span-4">
                <RecentApplicationsTable />
            </div>

            <div className="md:col-span-2 bg-[#111217] p-6 rounded-xl border border-[#4da3ff]/50 shadow-[0_0_25px_#4da3ff]/50">
                <h3 className="text-xl font-semibold mb-4 text-white">MSME Segment Distribution</h3>
                <SegmentPieChart />
            </div>
            <div className="md:col-span-2 bg-[#111217] p-6 rounded-xl border border-[#4da3ff]/50 shadow-[0_0_25px_#4da3ff]/50">
                <h3 className="text-xl font-semibold mb-4 text-white">Risk Profile Trends (30D)</h3>
                <RiskTrendLineChart />
            </div>
        </div>
    );

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0f1116] font-sans text-gray-100 selection:bg-[#4da3ff]/30">
            <LenderSidebar
                activeTab="dashboard"
                setActiveTab={(tab) => navigate(`/lender-${tab}`)}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                onLogout={handleLogout}
            />

            <div className="lg:ml-64 min-h-screen flex flex-col">
                <Header
                    user={user}
                    showSync={false}
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    isDarkMode={true}
                    toggleTheme={() => {}}
                    pageTitle="Dashboard Overview"
                />
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {dashboardContent}
                </main>
            </div>
        </div>
    );
}

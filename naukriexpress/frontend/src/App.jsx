import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // --- STATE ---
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('browse'); // 'browse' or 'my-apps'
  const [adminJob, setAdminJob] = useState({ companyName: '', role: '', location: '' });

  // --- ACTIONS ---
  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/users/jobs');
      setJobs(res.data || []);
    } catch (err) { console.error("Backend offline"); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/users/login', username, {
        headers: { 'Content-Type': 'application/json' }
      });
      setUser(res.data);
      fetchJobs();
    } catch (err) { alert("Login failed. Check IntelliJ!"); }
  };

  const applyJob = async (jobId) => {
    try {
      const res = await axios.post(`http://localhost:8080/api/users/${user.username}/apply/${jobId}`);
      setUser(res.data);
      alert("Application sent successfully!");
    } catch (err) { alert("Already applied or error occurred."); }
  };

  const revokeApp = async (companyName) => {
    if (!window.confirm(`Are you sure you want to revoke your application to ${companyName}?`)) return;
    try {
      const res = await axios.delete(`http://localhost:8080/api/users/${user.username}/revoke/${companyName}`);
      setUser(res.data);
    } catch (err) { alert("Error revoking application"); }
  };

  const postJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/users/admin/add-job', adminJob);
      setAdminJob({ companyName: '', role: '', location: '' });
      fetchJobs();
      alert("Job posted to Marketplace!");
    } catch (err) { alert("Admin posting failed"); }
  };

  // --- STYLING HELPERS ---
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Selected': return 'bg-emerald-100 text-emerald-700';
      case 'Rejected': return 'bg-rose-100 text-rose-700';
      case 'Interview': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  // --- VIEW: LOGIN ---
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-100 text-center transform transition-all hover:scale-[1.01]">
          <h1 className="text-4xl font-black text-slate-900 mb-2 italic tracking-tighter">NAUKRI EXPRESS</h1>
          <p className="text-slate-400 mb-10 text-[10px] font-black uppercase tracking-[0.4em]">Professional Career Hub</p>
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
            <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 hover:shadow-xl transition-all uppercase tracking-widest text-xs">
              Open Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW: DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#fbfcfd]">
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex justify-between items-center z-50 shadow-sm">
        <h2 className="text-2xl font-black italic tracking-tighter">NAUKRI <span className="text-blue-600 font-black">EXPRESS</span></h2>
        
        {view === 'browse' && (
          <input 
            type="text" 
            placeholder="Search company or role..." 
            className="hidden md:block w-80 px-6 py-2 rounded-full bg-slate-100 border-none text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        <div className="flex gap-8 items-center font-black text-[10px] tracking-[0.2em]">
          <button onClick={() => setView('browse')} className={view === 'browse' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600 transition-colors'}>MARKETPLACE</button>
          <button onClick={() => setView('my-apps')} className={view === 'my-apps' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600 transition-colors'}>MY TRACKER ({user.applications?.length || 0})</button>
          <button onClick={() => setUser(null)} className="bg-slate-900 text-white px-5 py-2 rounded-xl hover:bg-red-500 transition-all shadow-md">LOGOUT</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-12">
        {/* ADMIN PANEL */}
        {user.username === 'admin' && view === 'browse' && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl mb-16 transform transition-all hover:shadow-2xl">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tighter">Post a New Role <span className="text-blue-600 text-xs font-medium lowercase tracking-normal ml-2">Admin Mode</span></h3>
            <form onSubmit={postJob} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" placeholder="Company Name" className="p-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all" value={adminJob.companyName} onChange={e => setAdminJob({...adminJob, companyName: e.target.value})} required />
              <input type="text" placeholder="Role (e.g. SDE)" className="p-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all" value={adminJob.role} onChange={e => setAdminJob({...adminJob, role: e.target.value})} required />
              <input type="text" placeholder="Location" className="p-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all" value={adminJob.location} onChange={e => setAdminJob({...adminJob, location: e.target.value})} required />
              <button className="bg-blue-600 text-white font-black text-[10px] tracking-widest rounded-2xl hover:bg-slate-900 transition-all uppercase shadow-lg shadow-blue-100">Add to Board</button>
            </form>
          </div>
        )}

        {/* MARKETPLACE GRID */}
        {view === 'browse' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {jobs?.filter(j => j.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || j.role?.toLowerCase().includes(searchTerm.toLowerCase())).map((job) => (
              <div key={job.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:scale-110 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] hover:border-blue-100 transition-all duration-500 group relative overflow-hidden">
                <div className="flex items-center gap-5 mb-8">
                  <img 
                    src={`https://logo.clearbit.com/${job.companyName.toLowerCase().replace(/\s/g, '')}.com?size=100`} 
                    onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=" + job.companyName + "&background=f1f5f9&color=64748b"}
                    className="w-14 h-14 rounded-2xl object-contain bg-slate-50 p-2 shadow-inner border border-slate-100" 
                    alt="logo" 
                  />
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{job.companyName}</h4>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{job.role}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                  <span className="text-[10px] font-black bg-slate-50 px-3 py-1 rounded-lg text-slate-400 uppercase tracking-widest">{job.location}</span>
                  <button onClick={() => applyJob(job.id)} className="bg-slate-900 text-white text-[10px] font-black px-8 py-3 rounded-2xl hover:bg-blue-600 hover:shadow-lg transition-all uppercase tracking-widest">Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* TRACKER LIST */
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-4xl font-black mb-12 tracking-tighter italic">MY APPLICATIONS</h2>
            {user.applications?.length > 0 ? user.applications.map((app) => (
              <div key={app.companyName} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group">
                <div className="flex items-center gap-6">
                  <div className={`w-3 h-14 rounded-full ${getStatusStyle(app.status).split(' ')[0]}`}></div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{app.companyName}</h4>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
                      {app.role} • <span className="text-blue-600 font-black">{new Date(app.dateApplied).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusStyle(app.status)}`}>
                    {app.status}
                  </span>
                  <button onClick={() => revokeApp(app.companyName)} className="text-slate-200 font-black text-[10px] tracking-[0.2em] hover:text-red-500 transition-all uppercase">Revoke</button>
                </div>
              </div>
            )) : (
              <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-slate-400 font-bold italic">
                You haven't applied to any roles yet. Visit the Marketplace!
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
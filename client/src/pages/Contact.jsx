import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Copy, 
  Check,
  ArrowRight,
  Globe,
  Loader2,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Navbar } from '../components/Home/Navbar';

export const Contact = () => {
  const form = useRef();
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: ''});
  const [subject, setSubject] = useState('project'); 

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("akcoder1102004@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    // --- YOUR KEYS ---
    const SERVICE_ID = "service_lt8kyn";
    const TEMPLATE_ID = "template_1htgpkm";
    const PUBLIC_KEY = "jL4yK9dtp_gKmZalj";

    // --- REAL EMAILJS SERVICE ---
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          alert(`Thanks ${formData.name}! Anish will get back to you faster than a hot reload.`);
          setFormData({ name: '', email: '', message: '' });
      }, (error) => {
          console.error("EmailJS Error:", error.text);
          alert("Failed to send message. Please try again later or email directly.");
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">

      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-100 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="max-w-6xl w-full grid lg:grid-cols-5 bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden border border-white/50 relative z-10">
        
        {/* --- Left Side: Info & Personality --- */}
        <div className="lg:col-span-2 bg-slate-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
          
          {/* Abstract Shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          
          <div className="relative z-10 space-y-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Lets Chat
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">epic.</span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Have a project in mind? Looking to hire? Or just want to discuss the latest tech trends? I'm all ears.
              </p>
            </div>

            {/* Contact Details Card */}
            <div className="space-y-5">
              
              {/* Email */}
              <div 
                onClick={handleCopyEmail}
                className="group flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <Mail size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-400 mb-0.5">Email Address</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium truncate">akcoder1102004@gmail.com</p>
                    {copied ? <Check size={14} className="text-green-400 shrink-0" /> : <Copy size={14} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-0.5">Based in</p>
                  <p className="text-white font-medium">Chennai, India (IST)</p>
                </div>
              </div>

              {/* Website */}
              <a 
                href="https://anishkumar-v2.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800 transition-all"
              >
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <Globe size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-400 mb-0.5">Portfolio</p>
                  <p className="text-white font-medium truncate">anishkumar-v2.vercel.app</p>
                </div>
              </a>

            </div>
          </div>

          {/* Social Links Footer */}
          <div className="relative z-10 pt-12 flex gap-4">
            <a href="https://github.com/Anishkumar100" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 rounded-full hover:bg-white hover:text-slate-900 transition-all border border-slate-700 hover:border-white">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/anishkumar-dev/" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 rounded-full hover:bg-[#0077b5] hover:text-white transition-all border border-slate-700 hover:border-[#0077b5]">
              <Linkedin size={20} />
            </a>
          </div>
        </div>


        {/* --- Right Side: The Form --- */}
        <div className="lg:col-span-3 p-8 md:p-12 lg:p-16 bg-white">
          
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare className="text-indigo-600" size={24}/> 
              What can I help you with?
            </h2>

            {/* Subject Toggle */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { id: 'project', label: 'New Project', icon: Sparkles },
                { id: 'hire', label: 'Hiring', icon: Github },
                { id: 'hello', label: 'Saying Hi', icon: MessageSquare },
              ].map((item) => (
                <button 
                  key={item.id}
                  type="button"
                  onClick={() => setSubject(item.id)}
                  className={`
                    relative p-3 rounded-xl border text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2
                    ${subject === item.id 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.02]' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }
                  `}
                >
                  <item.icon size={18} className={subject === item.id ? 'text-indigo-400' : 'text-slate-400'} />
                  {item.label}
                </button>
              ))}
            </div>

            <form ref={form} onSubmit={handleSubmit} className="space-y-6">
              
              <input type="hidden" name="subject" value={subject} />

              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Your Name</label>
                    <input 
                      type="text" 
                      name="user_name" 
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      name="user_email" 
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Message</label>
                  <textarea 
                    rows={5}
                    name="message" 
                    required
                    placeholder={
                      subject === 'project' ? "I have an idea for a SaaS platform..." : 
                      subject === 'hire' ? "We're looking for a Full Stack Engineer..." : 
                      "Just wanted to stop by and say hello!"
                    }
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSending}
                  className="
                    group w-full md:w-auto px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-slate-900/20
                    hover:shadow-xl hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200
                    disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2
                  "
                >
                  {isSending ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-indigo-400" /> Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message <ArrowRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
    </>
  )
}

export default Contact;
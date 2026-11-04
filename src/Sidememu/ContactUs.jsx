import React, { useState } from "react";
import { FaInstagram, FaLinkedin, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Footer from "../components/MainSrceen/Footer";

const ContactUs = () => {
  // Form state
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  // ✅ Yahan apne sahi links daal lena
  const socialLinks = [
    { name: "Instagram", icon: <FaInstagram />, color: "#E1306C", url: "https://instagram.com/yourhandle" },
    { name: "LinkedIn", icon: <FaLinkedin />, color: "#0077B5", url: "https://linkedin.com/company/yourcompany" },
    { name: "WhatsApp", icon: <FaWhatsapp />, color: "#25D366", url: "https://wa.me/1234567890" },
  ];

  const openLink = (url) => {
    if (!url || url === "#") return alert("⚠️ Link not available yet.");
    window.open(url, "_blank");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${formData.name}! Your message has been sent.`);
    setFormData({ name: "", email: "", message: "" }); // Reset form
  };

  return (
    // 🔴 Pura Background White kar diya hai (bg-[#FFFAF5])
    <div className="min-h-screen bg-[#FFFAF5] text-gray-800 flex flex-col">
      
      <div className="container mx-auto px-6 py-16 flex-grow">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Have a question or need help? We are here to assist you. Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Main 2-Column Layout */}
        <div className="max-w-5xl mx-auto bg-[#FFFAF5] rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid md:grid-cols-2">
            
            {/* Left Side: Contact Info */}
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Get in Touch</h2>
              
              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-50 text-green-800 rounded-full flex items-center justify-center text-xl shrink-0">
                    <FaEnvelope />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Email Us</p>
                    <a href="mailto:support@hiddo.live" className="text-lg font-semibold text-gray-800 hover:text-green-800 transition-colors">
                      support@hiddo.live
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-50 text-green-800 rounded-full flex items-center justify-center text-xl shrink-0">
                    <FaPhone />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Call Us</p>
                    <p className="text-lg font-semibold text-gray-800">+1 (800) 123-4567</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-50 text-green-800 rounded-full flex items-center justify-center text-xl shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Location</p>
                    <p className="text-lg font-semibold text-gray-800">123 Hiddo HQ, Tech Park, USA</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 font-medium mb-4">Follow Us</p>
                <div className="flex gap-3">
                  {socialLinks.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => openLink(item.url)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                      style={{ backgroundColor: item.color }}
                      title={item.name}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="p-8 md:p-10 bg-[#FFFAF5]">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="How can we help you?"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent resize-none"
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-green-800 text-white font-bold py-3 rounded-lg hover:bg-green-800 transition-colors mt-2"
                >
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="relative z-10 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ContactUs;
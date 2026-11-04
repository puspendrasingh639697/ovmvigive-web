// GotQuestions.jsx
import React, { useState } from 'react'

function GotQuestions() {
    const [activeFAQ, setActiveFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setActiveFAQ(activeFAQ === index ? null : index);
    };
    
    const faqItems = [
        {
            question: "Is Hiddo free to use?",
            answer:
                "Absolutely! You can start chatting, private HD calls and meeting people for free. Some premium features like special gifts may require coins, but basic chats are totally free."
        },
        {
            question: "How do I download Hiddo?",
            answer:
                "You can easily download the Hiddo app from our official Website, PlayStore or App Store. Just tap the ‘Download’ button on our homepage and start connecting instantly."
        },
        {
            question: "Is it safe to use Hiddo?",
            answer:
                "Yes, your safety comes first! All users on Hiddo are verified, and our system actively blocks fake profiles and spam. Never share personal info with strangers and enjoy real, respectful connections."
        },
        {
            question: "How do Hiddo coins work?",
            answer:
                "Coins let you unlock premium perks like private HD calls, sending virtual gifts, and special interactions. You can top up anytime and make the most out of your experience."
        },
        {
            question: "Can I delete my payment info or account anytime?",
            answer:
                "Of course! You have full control over your data. Go to ‘Settings’ → ‘Payments’ to remove your saved cards, or contact support to delete your account securely."
        }
    ];
    
    return (
        <>
            {/* FAQ Section - WHITE BACKGROUND */}
            <section className="py-16 px-4 bg-[#FFFAF5]">
                <div className="max-w-4xl mx-auto">
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-800">
                        Got Questions? We’ve Got Answers
                    </h2>

                    <div className="space-y-4">
                        {faqItems.map((item, index) => (
                            // Card: White bg, light border, hover par pink border
                            <div 
                                key={index} 
                                className={`bg-[#FFFAF5] overflow-hidden border transition-all duration-300 ${
                                    activeFAQ === index 
                                    ? 'border-green-800 shadow-md' // Active hone par border pink
                                    : 'border-green-800 shadow-sm hover:border-green-800' // Inactive par light border, hover par pink
                                }`}
                            >
                                <button
                                    className="w-full px-6 py-4 text-left flex justify-between items-center transition-colors duration-200"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <span className={`font-semibold text-lg transition-colors duration-300 ${
                                        activeFAQ === index ? 'text-green-800' : 'text-gray-900 hover:text-green-800'
                                    }`}>
                                        {item.question}
                                    </span>
                                    <svg
                                        className={`w-5 h-5 text-green-800 transform transition-transform duration-300 ${
                                            activeFAQ === index ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {/* Answer Block - Light gray bg for slight contrast */}
                                {activeFAQ === index && (
                                    <div className="px-6 py-4 bg-[#FFFAF5] border-t border-gray-100">
                                        <p className="text-black leading-relaxed">{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default GotQuestions
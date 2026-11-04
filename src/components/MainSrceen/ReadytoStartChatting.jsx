// ReadytoStartChatting.jsx

import React from 'react'
import mapImage from '../../assets/images/MobileImage.png'

function ReadytoStartChatting() {
  return (
    <>
    {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          {/* <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Chatting?</h2> */}

 <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
    Ready to <span className="text-green-800">Start Chatting?</span>
  </h2>

         
  <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
    Grab the Hiddo application on iPhone or Android to enjoy the ultimate experience on your phone.
    Join millions of real users across the globe 🌎 and make new connections today.
    Start your journey now — in the app or right from your browser.
  </p>

          <div className="max-w-1xl flex flex-col items-center gap-4">
            <div className="flex flex-row gap-4 justify-center">
             

                <button className="bg-green-800 text-white font-semibold rounded-xl py-4 px-8 transition-all duration-300 hover:bg-green-800 hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]">
      Start Free Chat
    </button>

             


                 <button className="border border-green-800 text-green-800 font-semibold rounded-xl py-4 px-8 transition-all duration-300 hover:bg-green-800 hover:text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]">
      Download App
    </button>
            </div>

             <div className="mt-12">
                        <img
                          src={mapImage}
                          alt="Hiddo Global Community Map"
                          className="mx-auto rounded-2xl shadow-2xl max-w-full sm:max-w-2xl h-auto object-contain"
                          onError={(e) => {
                            console.error("⚠️ Image failed to load:", e.target.src);
                            e.target.style.display = "none";
                          }}
                        />
                      </div>




          </div>

        </div>
      </section>
    
    </>
  )
}

export default ReadytoStartChatting
// import React from 'react';
// import bgImage from '../../assets/images/bgimage.png';

// function PerksSection() {
//   return (
//     // 🔥 Background White, Padding kam ki hai taaki image full lage
//     <div className="w-full py-8 sm:py-12 bg-[#FFFAF5] overflow-hidden">
      
//       {/* 🔥 Image Container: Full Width (100%) */}
//       <div className="w-full">
//         <img 
//           src={bgImage} 
//           alt="Perks Section" 
//           // 🔥 Image ko full width aur auto height di hai
//           className="w-full h-auto object-cover block"
//         />
//       </div>
      
//     </div>
//   );
// }

// export default PerksSection;

import React from 'react';
import bgImage from '../../assets/images/bgimage.png';

function PerksSection() {
  return (
    <div className="w-full py-8 sm:py-12 bg-[#FFFAF5] overflow-hidden">
      <div className="w-full flex justify-center">
        <img 
          src={bgImage} 
          alt="Perks Section" 
          // 👇 mix-blend-multiply se white background gayab ho jayega
          className="w-full h-auto object-cover block mix-blend-multiply" 
        />
      </div>
    </div>
  );
}

export default PerksSection;
import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#FFFAF5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-black text-gray-900 mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 text-center mb-10">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, update your profile, use our interactive features (like chat, calls, gifts), or communicate with other users. This includes your name, email, age, gender, photos, and interests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to operate, maintain, and improve our services. This helps us match you with other users, facilitate communication, provide personalized content, and ensure the safety and security of our community.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Sharing of Information</h2>
            <p>
              We may share your information with other users as part of the normal operation of the service (e.g., your profile is visible to others). We do not sell your personal information to third parties. We may share data with service providers who assist us in operating the platform (like Cloudinary for images).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no internet transmission is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">5. Your Choices</h2>
            <p>
              You may update, correct, or delete your profile information at any time by logging into your account. You can also block or report other users if needed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@omnigive.com" className="text-green-700 underline">support@omnigive.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#FFFAF5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-black text-gray-900 mb-6 text-center">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 text-center mb-10">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the OmniGive platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. You must be at least 18 years old to use this platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. User Conduct</h2>
            <p>
              You agree to use the platform in a respectful and lawful manner. You will not engage in harassment, hate speech, or share explicit content. Any violation of these rules may result in account suspension or permanent ban without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Account Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. We are not liable for any loss or damage arising from your failure to protect your credentials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Payments & Subscriptions</h2>
            <p>
              Certain features of the platform (such as Gift Coins or Premium Membership) may require payment. All transactions are final and non-refundable unless otherwise stated. Prices are subject to change at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">5. Limitation of Liability</h2>
            <p>
              OmniGive is not responsible for the conduct of any user on or off the platform. We do not verify the accuracy of information provided by users. You use the service at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the platform after changes are posted constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">7. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:support@omnigive.com" className="text-green-700 underline">support@omnigive.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
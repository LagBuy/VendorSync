const TermsAndConditions = () => {
  return (
    <div className="bg-white bg-opacity-90 shadow-lg rounded-xl p-6 max-w-3xl mx-auto text-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Terms and Conditions
      </h2>

      <p className="mb-4 text-sm">
        By accessing and using this website or mobile app, you accept and agree
        to be bound by the terms and conditions outlined here. If you do not
        agree to these terms, please do not use our platform.
      </p>

      <h3 className="font-semibold mb-2">1. User Responsibilities</h3>
      <ul className="list-disc list-inside mb-4 text-sm">
        <li>
          Provide accurate and complete information when registering or using
          our services.
        </li>
        <li>
          Do not engage in fraudulent, abusive, or illegal activities on the
          platform.
        </li>
        <li>Keep your login credentials secure and confidential.</li>
      </ul>

      <h3 className="font-semibold mb-2">2. Verification</h3>
      <p className="mb-4 text-sm">
        Users may be required to verify their identity using valid documents. We
        reserve the right to approve or reject any verification attempt based on
        the clarity or authenticity of the submitted documents.
      </p>
      <p className="text-red-500 font-extrabold">
        Failure to verify your account means you won't be eligible for
        payments/cashouts.
      </p>

      <h3 className="font-semibold mb-2 mt-3">3. Privacy</h3>
      <p className="mb-4 text-sm">
        We respect your privacy and are committed to protecting your personal
        data. Your information will only be used according to our privacy
        policy.
      </p>

      <h3 className="font-semibold mb-2">4. Modifications</h3>
      <p className="mb-4 text-sm">
        We reserve the right to update or change these terms at any time,{" "}
        <span className="text-red-500 font-extrabold">
          but you will be informed.
        </span>{" "}
        Continued use of the service after such changes means you accept the new
        terms.
      </p>

      <h3 className="font-semibold mb-2">5. Contact</h3>
      <p className="text-sm">
        For any questions or concerns about these terms, please contact us at{" "}
        <span className="text-blue-600">lagbuysupport@gmail.com</span>.
      </p>
    </div>
  );
};

export default TermsAndConditions;

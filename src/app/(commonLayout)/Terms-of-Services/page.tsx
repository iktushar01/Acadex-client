const TermsOfServicePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        Terms of Service
      </h1>

      <p className="text-muted-foreground mb-6">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      {/* Intro */}
      <section className="space-y-4 mb-8">
        <p>
          Welcome to Acadex. By accessing or using our platform, you agree to
          these Terms of Service. Please read them carefully.
        </p>
      </section>

      {/* Use of Service */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          1. Use of the Service
        </h2>
        <p>
          Acadex provides a platform for sharing notes, managing classrooms,
          and collaborating. You agree to use the service only for lawful
          purposes and in a respectful manner.
        </p>
      </section>

      {/* Accounts */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          2. User Accounts
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You are responsible for your account and credentials</li>
          <li>Provide accurate and up-to-date information</li>
          <li>Do not share your account with others</li>
        </ul>
      </section>

      {/* Content */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          3. User Content
        </h2>
        <p>
          You retain ownership of the content you upload. However, you grant
          Acadex permission to store, display, and distribute your content
          within the platform.
        </p>
      </section>

      {/* Prohibited */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          4. Prohibited Activities
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Uploading harmful, illegal, or abusive content</li>
          <li>Attempting to hack or disrupt the platform</li>
          <li>Violating others’ rights or privacy</li>
        </ul>
      </section>

      {/* Termination */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          5. Termination
        </h2>
        <p>
          We may suspend or terminate your account if you violate these terms
          or misuse the platform.
        </p>
      </section>

      {/* Liability */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          6. Limitation of Liability
        </h2>
        <p>
          Acadex is provided "as is". We are not responsible for data loss,
          service interruptions, or any damages resulting from use of the
          platform.
        </p>
      </section>

      {/* Changes */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          7. Changes to Terms
        </h2>
        <p>
          We may update these Terms at any time. Continued use of the platform
          means you accept the updated terms.
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          8. Contact Us
        </h2>
        <p>
          For any questions about these Terms, contact us at:
          <br />
          <span className="font-medium">support@acadex.com</span>
        </p>
      </section>
    </div>
  );
};

export default TermsOfServicePage;
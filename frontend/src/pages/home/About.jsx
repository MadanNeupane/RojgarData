import { Link } from "react-router-dom";
import PageTemplate from "@/src/components/PageTemplate";

const About = () => {
  return (
    <PageTemplate>
      <div className="max-w-4xl mx-auto p-6 text-gray-800 dark:text-gray-100">
        <h1 className="text-4xl font-bold text-center mb-4">
          About RojgarData
        </h1>
        <p className="text-xl text-center mb-10">
          <span className="text-gray-600 dark:text-gray-400 italic">Where Career Meets Transparency.</span>
        </p>

        <section className="space-y-4 mb-12">
          <p>
            Welcome to <span className="font-medium text-blue-600 dark:text-blue-400">RojgarData</span> — your go-to platform for all things career. Whether you're a job seeker searching for the perfect role or an employer managing listings and profiles, RojgarData bridges the gap with clarity and simplicity.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mt-6">
            Our Purpose
          </h2>
          <p>
            We believe in a transparent job market. Our mission is to connect professionals and employers meaningfully, with tools that make hiring and discovery both insightful and efficient.
          </p>

          <ul className="list-disc list-inside space-y-2 mt-4 ml-2">
            <li><strong>Job Listings</strong> to help candidates find the right fit.</li>
            <li><strong>Salary Insights</strong> for fair and informed negotiation.</li>
            <li><strong>Company Profiles, Q &amp; A, and Reviews</strong> to explore workplace culture before applying.</li>
            <li><strong>Blogs</strong> offering expert advice, trends, and guidance.</li>
            <li><strong>Employer Management</strong> for easy job posting and applicant tracking.</li>
          </ul>
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
            Technology & Future Scope
          </h2>
          <p>
            RojgarData is built using modern technologies including Django REST Framework (DRF) with JWT authentication, React with Router v6, Tailwind CSS, and ShadCN UI for a sleek user experience.
          </p>
          <p>
            We're hosted on Render, use Postgres for data storage, and Cloudinary for media files. The entire platform is modular and scalable — designed to grow.
          </p>

          <p className="font-medium">Planned Features:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Advanced review & reporting system</li>
            <li>Spam detection & moderation</li>
            <li>Nested replies and community discussions</li>
            <li>Monetization through ad placements</li>
            <li>Gamification to boost engagement</li>
          </ul>
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
            Project for Sale
          </h2>
          <p>
            RojgarData — the platform, domain, and entire ecosystem — is available for acquisition.
            The name combines meaning with marketability:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              <strong>"Rojgar" (रोजगार)</strong> – Job, in Hindi/Nepali.
            </li>
            <li>
              <strong>"Data" (डेटा)</strong> – Representing stats, insights, and employer profiles.
            </li>
            <li>
              <strong>"Data" (दाता)</strong> – Also means "provider" in Nepali/Hindi.
            </li>
          </ul>

          <p>
            The brand is catchy, easy to remember, and highly relevant. Social handles are available too.
            Interested? Email us at{" "}
            <a
              href="mailto:domain@rojgardata.com"
              className="text-blue-600 underline dark:text-blue-400"
            >
              domain@rojgardata.com
            </a>{" "}
            or visit our{" "}
            <Link to="/contact" className="text-blue-600 underline dark:text-blue-400">
              Contact Page
            </Link>.
          </p>
        </section>
      </div>
    </PageTemplate>
  );
};

export default About;

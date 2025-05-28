import Navbar from "@/src/components/Navbar";
import Newsletter from "@/src/components/Newsletter";
import Footer from "@/src/components/Footer";


const PageTemplate = ({ children }) => {
  return (
    <>
      <Navbar isAuthenticated={true} onLogout={() => { localStorage.clear(); window.location.reload(); }} />
      <div className="space-y-12">

        {/* Main Content */}
        <main className="container mx-auto my-12 py-10">
          {children}
        </main>

        {/* Newsletter Section */}
        <section className="px-4 md:px-12 lg:px-24 py-12 bg-gray-100 dark:bg-gray-800">
            <Newsletter />
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default PageTemplate;

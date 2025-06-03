import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/button";
import PageTemplate from "@/src/components/PageTemplate";

const NotFound = () => {
  return (
    <PageTemplate>
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-9xl font-extrabold text-gray-300 dark:text-gray-600">
          404
        </h1>
        <p className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">
          Sorry, we can't find this page.
        </p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          But don't worry, you can find plenty of other things on our homepage.
        </p>
        <Link to="/">
          <Button className="mt-6 px-8 py-3 text-base">
            Back to homepage
          </Button>
        </Link>
      </div>
    </PageTemplate>
  );
};

export default NotFound;

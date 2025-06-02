import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/button";

const HeroSection = ({ title, subtitle, description, buttonLabel, buttonLink }) => {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20 px-6 text-center">
      {title && <h1 className="text-4xl font-bold my-4">{title}</h1>}
      {subtitle && <p className="mb-6 text-lg">{subtitle}</p>}
      {buttonLabel && buttonLink && (
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white hover:no-underline">
          <Link to={buttonLink}>{buttonLabel}</Link>
        </Button>
      )}
      {description && <p className="mt-6 text-sm text-white/80">{description}</p>}
    </section>
  );
};

export default HeroSection;

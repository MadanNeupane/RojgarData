import { cn } from "@/lib/utils"; // Optional: Tailwind class merger

const Sidebar = ({ children, position = "left", className = "" }) => {
  const positionClasses = position === "right" ? "md:order-last" : "";

  return (
    <aside
      className={cn(
        "md:sticky md:top-20 h-fit md:col-span-1 space-y-4",
        positionClasses,
        className
      )}
    >
      {children}
    </aside>
  );
};

export default Sidebar;

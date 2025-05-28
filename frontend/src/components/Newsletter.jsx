import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

const Newsletter = () => {
  return (
    <div className="max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">Subscribe to our newsletter</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Get weekly updates on latest jobs and industry trends.</p>
        <div className="flex items-center gap-2 justify-center">
            <Input placeholder="Enter your email" className="w-full max-w-sm rounded-md" />
            <Button>Subscribe</Button>
        </div>
    </div>
  )
}
export default Newsletter
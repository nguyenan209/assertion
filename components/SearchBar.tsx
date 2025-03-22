// components/SearchBar.tsx
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Find your project"
        className="w-full bg-gray-800 text-white border-gray-600 focus:ring-blue-500"
      />
      <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  );
}

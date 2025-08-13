"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  return (
    <div className="w-full max-w-sm">
      <Input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
}
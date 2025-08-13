"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CategoryFilterProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ categories, onSelectCategory }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Articles");

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant={selectedCategory === "All Articles" ? "default" : "outline"}
        onClick={() => handleSelectCategory("All Articles")}
      >
        All Articles
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => handleSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
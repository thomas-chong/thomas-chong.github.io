"use client";

import { useState } from 'react';
import { BlogCard } from '@/components/blog/BlogCard';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { SearchBar } from '@/components/blog/SearchBar';
import { NewsletterForm } from '@/components/blog/NewsletterForm';

interface BlogPageContentProps {
  allPostsData: {
    id: string;
    date: string;
    title: string;
    description: string;
    category: string;
    author: string;
  }[];
}

export function BlogPageContent({ allPostsData }: BlogPageContentProps) {
  const [filteredPosts, setFilteredPosts] = useState(allPostsData);
  const [selectedCategory, setSelectedCategory] = useState("All Articles");

  const categories = [...new Set(allPostsData.map((post) => post.category))];

  const handleSearch = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = allPostsData.filter((post) => {
      return (
        (post.title.toLowerCase().includes(lowercasedQuery) ||
          post.description.toLowerCase().includes(lowercasedQuery)) &&
        (selectedCategory === "All Articles" || post.category === selectedCategory)
      );
    });
    setFilteredPosts(filtered);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === "All Articles") {
      setFilteredPosts(allPostsData);
    } else {
      const filtered = allPostsData.filter((post) => post.category === category);
      setFilteredPosts(filtered);
    }
  };

  return (
    <>
      <div className="mt-12 flex flex-col items-center gap-8">
        <SearchBar onSearch={handleSearch} />
        <CategoryFilter
          categories={categories}
          onSelectCategory={handleSelectCategory}
        />
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map(({ id, date, title, description, author }) => (
          <BlogCard
            key={id}
            slug={id}
            title={title}
            excerpt={description}
            author={author}
            date={date}
          />
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <NewsletterForm />
      </div>
    </>
  );
}
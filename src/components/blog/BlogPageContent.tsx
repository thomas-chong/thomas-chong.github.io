"use client";

import { BlogCard } from '@/components/blog/BlogCard';

interface BlogPageContentProps {
  allPostsData: {
    id: string;
    date: string;
    title: string;
    description: string;
    tags: string[];
    author: string;
    image?: string;
  }[];
}

export function BlogPageContent({ allPostsData }: BlogPageContentProps) {
  return (
    <div className="mt-12 grid gap-8">
      {allPostsData.map(({ id, date, title, description, author, tags, image }) => (
        <BlogCard
          key={id}
          slug={id}
          title={title}
          excerpt={description}
          author={author}
          date={date}
          tags={tags}
          image={image}
        />
      ))}
    </div>
  );
}
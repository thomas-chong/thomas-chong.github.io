import { getSortedPostsData } from '@/lib/posts';
import { BlogPageContent } from '@/components/blog/BlogPageContent';

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Blog Posts
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover the latest insights and tutorials about modern web development, UI design, and component-driven architecture.
          </p>
        </div>
        <BlogPageContent allPostsData={allPostsData} />
      </div>
    </section>
  );
}
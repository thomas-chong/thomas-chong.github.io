import { getSortedPostsData } from '@/lib/posts';
import { BlogPageContent } from '@/components/blog/BlogPageContent';

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium tracking-wide text-muted-foreground">
            Blog
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Latest Insights & Updates
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Stay up to date with the latest trends, tutorials, and best practices in software development. Our experts share their knowledge to help you build better applications.
          </p>
        </div>
        <BlogPageContent allPostsData={allPostsData} />
      </div>
    </section>
  );
}
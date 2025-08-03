import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium tracking-wide text-muted-foreground">
            Blog Section
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Short and clear engaging headline for a blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Add a concise value statement that captures reader interest and
            previews content value. Focus on benefits while keeping it under two
            lines. Align with your blog categories.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {allPostsData.map(({ id, date, title, description, category }) => (
            <Link href={`/blog/${id}`} key={id} className="group">
              <div className="overflow-hidden rounded-lg">
                <div className="aspect-w-16 aspect-h-9 bg-muted" />
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  {date} &middot; {category}
                </p>
                <h2 className="mt-2 text-lg font-semibold group-hover:text-primary">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
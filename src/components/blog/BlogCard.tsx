import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "lucide-react";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  tags: string[];
  image?: string;
}

export function BlogCard({ slug, title, excerpt, author, date, tags, image }: BlogCardProps) {
  return (
    <div className={`grid gap-8 ${image ? 'md:grid-cols-2' : ''} items-center`}>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h2>
        <p className="text-muted-foreground">{excerpt}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{author}</p>
            <span className="text-sm text-muted-foreground">•</span>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
        </div>
        <Link
          href={`/blog/${slug}`}
          className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
        >
          Read more
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
      {image && image.trim() && (
        <Image
          src={image}
          alt={title}
          width={600}
          height={400}
          className="rounded-lg object-cover"
        />
      )}
    </div>
  );
}
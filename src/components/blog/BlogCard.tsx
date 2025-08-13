import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
}

export function BlogCard({ slug, title, excerpt, author, date }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{excerpt}</p>
          <div className="flex items-center pt-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatar.jpeg" alt="Author" />
              <AvatarFallback>{author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <p className="text-sm font-medium leading-none">{author}</p>
              <p className="text-sm text-muted-foreground">{date}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
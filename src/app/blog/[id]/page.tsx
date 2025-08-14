import { getPostData, getAllPostIds } from '@/lib/posts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths;
}

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function Post({ params }: PostPageProps) {
  const postData = await getPostData(params.id);

  return (
    <article className="container mx-auto py-8 px-4 md:px-6 prose prose-lg">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {postData.title}
        </h1>
        <div className="flex items-center pt-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatar.jpeg" alt="Author" />
            <AvatarFallback>{postData.author?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <p className="text-sm font-medium leading-none">{postData.author}</p>
            <p className="text-sm text-muted-foreground">{postData.date}</p>
          </div>
        </div>
        <div className="prose prose-lg mt-8" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </div>
    </article>
  );
}
import { getPostData, getAllPostIds } from '@/lib/posts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TableOfContents from '@/components/blog/TableOfContents';
import AnimatedDiv from '@/components/blog/AnimatedDiv';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths;
}

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postData = await getPostData(id);

  return (
    <AnimatedDiv>
      <article className="container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3">
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4" style={{ textDecoration: 'none' }}>
                {postData.title}
              </h1>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatar.jpeg" alt="Author" />
                  <AvatarFallback>{postData.author?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <p className="text-sm font-medium leading-none">{postData.author}</p>
                  <p className="text-sm text-muted-foreground">{postData.date}</p>
                </div>
              </div>
            </div>
            <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
          </div>
          <div className="hidden md:block md:col-span-1">
            <TableOfContents toc={postData.toc} />
          </div>
        </div>
      </article>
    </AnimatedDiv>
  );
}
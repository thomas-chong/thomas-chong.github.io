import { getPostData, getAllPostIds } from '@/lib/posts';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths;
}

export default async function Post({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id);

  return (
    <article className="prose prose-lg mx-auto py-8">
      <h1>{postData.title}</h1>
      <p className="text-muted-foreground">{postData.date}</p>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </article>
  );
}
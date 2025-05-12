import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// Using Next/Image for optimized images is a good practice if images are local or need optimization.
// For simplicity with external placeholders, a regular img tag is used here.
// import Image from 'next/image'; 

export default function PublicationsPage() {
  const publications = [
    {
      title: "Theoremexplainagent: Towards multimodal explanations for llm theorem understanding",
      authors: "M Ku, T Chong, J Leung, K Shah, A Yu, W Chen",
      journal: "arXiv preprint arXiv:2502.19400",
      year: "2025",
      abstract: "Towards multimodal explanations for LLM theorem understanding.",
      pdfLink: "https://arxiv.org/abs/2502.19400",
      doiLink: "#",
      imagePreviewUrl: "https://placehold.co/600x300/EEE/31343C?text=Theoremexplainagent", // Placeholder image
    },
    {
      title: "HKCanto-Eval: A Benchmark for Evaluating Cantonese Language Understanding and Cultural Comprehension in LLMs",
      authors: "TC Cheng, CS Cheng, CM Lau, ETH Lam, CY Wong, HO Yu, CH Chong",
      journal: "arXiv preprint arXiv:2503.12440",
      year: "2025",
      abstract: "A benchmark for evaluating Cantonese language understanding and cultural comprehension in LLMs.",
      pdfLink: "https://arxiv.org/abs/2503.12440", 
      doiLink: "#",
      imagePreviewUrl: "https://placehold.co/600x300/EEE/31343C?text=HKCanto-Eval", // Placeholder image
    },
  ];

  return (
    <section>
      <h1 className="text-3xl font-bold mb-8">Publications</h1>
      <div className="space-y-8"> {/* Increased space between cards slightly */}
        {publications.map((pub, index) => (
          <Card key={index}>
            {pub.imagePreviewUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img 
                  src={pub.imagePreviewUrl} 
                  alt={`Preview for ${pub.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader className={pub.imagePreviewUrl ? "pt-4" : ""}> {/* Adjust padding if image exists */}
              <CardTitle>{pub.title}</CardTitle>
              <CardDescription>
                {pub.authors} - {pub.year}
              </CardDescription>
              <CardDescription>{pub.journal}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{pub.abstract}</p>
            </CardContent>
            <CardFooter className="flex space-x-4">
              <Button asChild variant="outline">
                <Link href={pub.pdfLink} target="_blank" rel="noopener noreferrer">
                  PDF
                </Link>
              </Button>
              {pub.doiLink !== "#" && (
                <Button asChild variant="outline">
                  <Link href={pub.doiLink} target="_blank" rel="noopener noreferrer">
                    DOI
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
} 
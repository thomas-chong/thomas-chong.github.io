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
import { Badge } from "@/components/ui/badge";
import { BookText, Globe, Github } from "lucide-react";
// Using Next/Image for optimized images is a good practice if images are local or need optimization.
// For simplicity with external placeholders, a regular img tag is used here.
import Image from 'next/image';

export default function PublicationsPage() {
  const publications = [
    {
      title: "TheoremExplainAgent: Towards Video-based Multimodal Explanations for LLM Theorem Understanding",
      authors: ["Thomas Chong*", "Max Ku*", "Jonathan Leung", "Krish Shah", "Alvin Yu", "Wenhu Chen"],
      journal: "ACL 2025 main",
      year: "2025",
      abstract: "Towards multimodal explanations for LLM theorem understanding.",
      pdfLink: "https://arxiv.org/abs/2502.19400",
      doiLink: "#",
      websiteLink: "https://tiger-ai-lab.github.io/TheoremExplainAgent/",
      githubLink: "https://github.com/TIGER-AI-Lab/TheoremExplainAgent",
      imagePreviewUrl: "/images/publications/theorem_explain_agent.png", // Updated path
    },
    {
      title: "HKCanto-Eval: A Benchmark for Evaluating Cantonese Language Understanding and Cultural Comprehension in LLMs",
      authors: ["Tsz Chung Cheng", "Chung Shing Cheng", "Chaak Ming Lau", "Eugene Tin-Ho Lam", "Chun Yat Wong", "Hoi On Yu", "Cheuk Hei Chong"],
      journal: "ACL 2025 CoNLL",
      year: "2025",
      abstract: "A benchmark for evaluating Cantonese language understanding and cultural comprehension in LLMs.",
      pdfLink: "https://arxiv.org/abs/2503.12440", 
      doiLink: "#",
      websiteLink: "#",
      githubLink: "https://github.com/hon9kon9ize/hkeval2025",
      imagePreviewUrl: "images/publications/hkcanto_eval.png", // Placeholder image
    },
  ];

  return (
    <section>
      <h1 className="text-3xl font-bold mb-8">Publications</h1>
      <div className="space-y-10"> {/* Further increased space between cards */}
        {publications.map((pub, index) => (
          <Card key={index} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"> {/* Added subtle shadow and hover effect */}
            <div className="flex flex-col md:flex-row p-4"> {/* Added p-4 here */}
              {pub.imagePreviewUrl && (
                <div className="md:w-1/3 shrink-0 mb-4 md:mb-0 md:mr-4"> {/* Added margin for spacing from text */}
                  <Image
                    src={pub.imagePreviewUrl}
                    alt={`Preview for ${pub.title}`}
                    className="w-full h-auto max-h-48 md:h-full object-contain rounded-md" // Updated classes
                    width={500}
                    height={300}
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col"> {/* Removed p-6 from here */}
                <CardHeader className="p-0 pb-4"> {/* Removed default CardHeader padding, added bottom padding */}
                  <CardTitle>{pub.title}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-wrap gap-2 mb-2"> {/* Container for author badges */}
                      {pub.authors.map((author, authorIndex) => {
                        const hasAsterisk = author.includes("*");
                        const nameForComparison = author.replace("*", ""); // Name without asterisk for comparison
                        const isMyName = nameForComparison === "Thomas Chong" || nameForComparison === "Cheuk Hei Chong";
                        
                        return (
                          <Badge 
                            key={authorIndex} 
                            variant={isMyName ? "default" : "secondary"}
                            className={`text-sm ${hasAsterisk ? "underline" : ""}`}
                          >
                            {author} {/* Display the original author string (with asterisk if present) */}
                          </Badge>
                        );
                      })}
                    </div>
                    {pub.year} {/* Year can be displayed separately or with journal */}
                  </CardDescription>
                  <CardDescription>{pub.journal}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 pb-4 flex-grow"> {/* Removed default CardContent padding, added bottom padding, allow content to grow */}
                  <p className="text-sm text-muted-foreground">{pub.abstract}</p> {/* Styled abstract slightly */}
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 p-0 pt-4 border-t border-muted mt-auto"> {/* Flex-wrap and gap for button responsiveness, removed default padding, added top padding and border, push to bottom */}
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={pub.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BookText className="mr-2 h-4 w-4" /> arXiv
                    </Link>
                  </Button>
                  {pub.doiLink !== "#" && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={pub.doiLink} target="_blank" rel="noopener noreferrer">
                        DOI
                      </Link>
                    </Button>
                  )}
                  {pub.websiteLink !== "#" && (
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={pub.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="mr-2 h-4 w-4" /> Website
                      </Link>
                    </Button>
                  )}
                  {pub.githubLink !== "#" && (
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={pub.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" /> GitHub
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
} 
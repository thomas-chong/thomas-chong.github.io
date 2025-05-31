import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, GraduationCap, Github, Linkedin, Mail } from "lucide-react";

export default function HomePage() {
  const user = {
    name: "Thomas Chong",
    preferredName: "Thomas Chong (Cheuk Hei Chong)",
    title: "AI Research Engineer at Beever AI",
    avatarSrc: "/avatar.jpeg",
    avatarFallback: "TC",
    bio: "I am an AI Research Engineer at Beever AI, specializing in Natural Language Processing (NLP), Large Multimodal Models (LMMs), and low-resource language understanding. My work focuses on advancing the capabilities of AI in these areas, bridging the gap between theoretical understanding and practical applications in multilingual AI systems.",
    researchDimensions: [
      {
        title: "Natural Language Processing (NLP)",
        description: "Investigating the fundamental aspects of language models, including their behavioral patterns, post-training optimization, and emergent capabilities as language agents. My work spans both academic research and industrial applications, contributing to our understanding of how these models develop and deploy their linguistic capabilities.",
      },
      {
        title: "Large Multimodal Models (LMMs)",
        description: "Drawing from a multilingual background, I explore how LMMs acquire and process cross-linguistic knowledge. This research not only advances our technical understanding of language models but also provides insights into human language acquisition and processing, particularly for models integrating text, images, and audio.",
      },
      {
        title: "Low-Resource Language Technologies",
        description: "Focusing on developing methods and models to support languages with limited data and resources, including work on benchmarks like HKCanto-Eval for evaluating Cantonese language understanding and cultural comprehension in LLMs.",
      },
    ],
    socialLinks: [
      {
        href: "mailto:chchongaa@connect.ust.hk",
        icon: Mail,
        label: "chchongaa@connect.ust.hk",
      },
      {
        href: "https://scholar.google.com/citations?user=aV-Ddp4AAAAJ",
        icon: GraduationCap,
        label: "Google Scholar",
      },
      {
        href: "https://www.linkedin.com/in/chongcht/",
        icon: Linkedin,
        label: "LinkedIn",
      },
      {
        href: "https://github.com/thomas-chong",
        icon: Github,
        label: "thomas-chong",
      },
    ],
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 py-6">
      <aside className="w-full md:w-1/3 lg:w-1/4 space-y-5 md:sticky md:top-24 md:self-start">
        <Avatar className="w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0">
          <AvatarImage src={user.avatarSrc} alt={user.name} />
          <AvatarFallback>{user.avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-semibold">{user.preferredName}</h2>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            <span>{user.title}</span>
          </li>
          {user.socialLinks.map((link) => (
            <li key={link.label} className="flex items-center gap-2">
              <link.icon className="w-4 h-4 flex-shrink-0" />
              <Link href={link.href} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <section className="w-full md:w-2/3 lg:w-3/4 space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-1">{user.name}</h1>
          <p className="text-xl text-muted-foreground">{user.title}</p>
        </div>
        
        <p className="text-lg leading-relaxed">
          {user.bio}
        </p>

        <div className="space-y-6">
          {user.researchDimensions.map((dimension) => (
            <div key={dimension.title}>
              <h3 className="text-xl font-semibold mb-2 text-primary">{dimension.title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{dimension.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

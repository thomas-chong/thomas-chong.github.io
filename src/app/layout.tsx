import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thomas Chong - Academic Page",
  description: "Personal academic website of Thomas Chong, AI Research Engineer at Beever AI.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider defaultTheme="system" enableSystem>
          <header className="container mx-auto p-4 mb-8">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                Thomas Chong
              </Link>

              <div className="flex items-center gap-4">
                <NavigationMenu className="hidden md:flex">
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="/" className={navigationMenuTriggerStyle()}>
                          Home
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/publications" className={navigationMenuTriggerStyle()}>
                          Publications
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/blog" className={navigationMenuTriggerStyle()}>
                          Blog
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                <ThemeToggle />

                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <nav className="flex flex-col space-y-4 mt-6">
                        <SheetClose asChild>
                          <Link
                            href="/"
                            className="text-lg font-medium hover:underline underline-offset-4"
                          >
                            Home
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/publications"
                            className="text-lg font-medium hover:underline underline-offset-4"
                          >
                            Publications
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/blog"
                            className="text-lg font-medium hover:underline underline-offset-4"
                          >
                            Blog
                          </Link>
                        </SheetClose>
                      </nav>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto p-4 flex-grow">
            {children}
          </main>
          <footer className="container mx-auto p-4 mt-12 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Thomas Chong. All rights reserved.</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

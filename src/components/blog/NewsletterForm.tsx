"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log("Subscribing with email:", email);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Label htmlFor="email">Subscribe to our newsletter</Label>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit">Subscribe</Button>
      </div>
    </form>
  );
}
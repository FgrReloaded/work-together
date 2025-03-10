"use client";

import { useState } from "react";
import { useAiPrompt } from "@/hooks/useAiPrompt";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Loader2 } from "lucide-react";

export const AiPrompt = () => {
  const [prompt, setPrompt] = useState("");
  const [open, setOpen] = useState(false);
  const { generateContent, isLoading, error } = useAiPrompt();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await generateContent(prompt);
      toast.success("AI content generated successfully");
      setOpen(false);
      setPrompt("");
    } catch (err) {
      toast.error("Failed to generate content");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 h-8 bg-white text-slate-600 hover:text-slate-700"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden md:block">Generate with AI</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate with AI</DialogTitle>
          <DialogDescription>
            Describe what you want to create on the canvas
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="E.g., Create a mindmap about AI technologies"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isLoading || !prompt.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

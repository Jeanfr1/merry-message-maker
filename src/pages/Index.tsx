import React, { useState } from "react";
import LetterForm from "@/components/LetterForm";
import LetterPreview from "@/components/LetterPreview";
import Snowfall from "@/components/Snowfall";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [letter, setLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateLetter = async (data: {
    childName: string;
    age: string;
    wishList: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are Santa Claus writing a personalized letter to a child. Keep the tone warm, magical, and encouraging. Include specific details about their wish list but don't promise specific gifts. Mention the North Pole, reindeer, and elves. Keep it under 300 words.",
            },
            {
              role: "user",
              content: `Write a letter to ${data.childName} who is ${data.age} years old. Their wish list includes: ${data.wishList}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate letter");
      }

      const result = await response.json();
      setLetter(result.choices[0].message.content);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-christmas-pine to-christmas-green py-12 px-4 relative">
      <Snowfall />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-christmas-snow text-center mb-8">
          Letters from Santa
        </h1>
        <p className="text-christmas-snow text-center mb-12">
          Create a magical Christmas letter from Santa Claus himself!
        </p>
        <div className="bg-white/90 rounded-lg p-8 backdrop-blur-sm">
          <LetterForm onSubmit={generateLetter} isLoading={isLoading} />
          {letter && <LetterPreview letter={letter} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
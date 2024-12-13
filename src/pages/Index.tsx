import React, { useState } from "react";
import LetterForm from "@/components/LetterForm";
import LetterPreview from "@/components/LetterPreview";
import { supabase } from "@/integrations/supabase/client";
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
      const { data: response, error } = await supabase.functions.invoke(
        "generate-letter",
        {
          body: {
            child_name: data.childName,
            age: data.age,
            wish_list: data.wishList,
          },
        }
      );

      if (error) throw error;

      setLetter(response.letter);
      toast({
        title: "Letter Generated!",
        description: "Your magical letter from Santa is ready!",
      });
    } catch (error) {
      console.error("Error:", error);
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
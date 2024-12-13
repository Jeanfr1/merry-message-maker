import React from "react";
import { Button } from "@/components/ui/button";

interface LetterPreviewProps {
  letter: string;
}

const LetterPreview = ({ letter }: LetterPreviewProps) => {
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([letter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "letter-from-santa.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-christmas-snow p-8 rounded-lg shadow-lg border-2 border-christmas-gold">
        <div className="font-serif whitespace-pre-wrap text-christmas-green">
          {letter}
        </div>
      </div>
      {letter && (
        <Button
          onClick={handleDownload}
          className="mt-4 bg-christmas-green hover:bg-christmas-pine text-white"
        >
          Download Letter
        </Button>
      )}
    </div>
  );
};

export default LetterPreview;
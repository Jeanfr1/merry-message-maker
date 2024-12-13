import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface LetterFormProps {
  onSubmit: (data: {
    childName: string;
    age: string;
    wishList: string;
  }) => void;
  isLoading: boolean;
}

const LetterForm = ({ onSubmit, isLoading }: LetterFormProps) => {
  const [childName, setChildName] = React.useState("");
  const [age, setAge] = React.useState("");
  const [wishList, setWishList] = React.useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName || !age || !wishList) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    onSubmit({ childName, age, wishList });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-christmas-green font-semibold mb-2">
          Child's Name
        </label>
        <Input
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          className="border-christmas-green"
          placeholder="Enter child's name"
        />
      </div>
      <div>
        <label className="block text-christmas-green font-semibold mb-2">
          Age
        </label>
        <Input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          type="number"
          min="1"
          max="12"
          className="border-christmas-green"
          placeholder="Enter age"
        />
      </div>
      <div>
        <label className="block text-christmas-green font-semibold mb-2">
          Wish List (up to 3 items)
        </label>
        <Textarea
          value={wishList}
          onChange={(e) => setWishList(e.target.value)}
          className="border-christmas-green"
          placeholder="Enter wish list items (one per line)"
          rows={3}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-christmas-red hover:bg-christmas-pine text-white"
        disabled={isLoading}
      >
        {isLoading ? "Generating Letter..." : "Generate Santa's Letter"}
      </Button>
    </form>
  );
};

export default LetterForm;
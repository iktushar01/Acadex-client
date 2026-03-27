"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, BookOpen, Check, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner"; 
import { createSubjectAction } from "@/app/(dashboardLayout)/dashboard/classroom/subject/[id]/add/_action";

// These are the 4-5 demo images users can choose from
const DEMO_COVERS = [
  { id: 1, url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80", label: "Library" },
  { id: 2, url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80", label: "Education" },
  { id: 3, url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80", label: "Books" },
  { id: 4, url: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=800&q=80", label: "Study" },
  { id: 5, url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80", label: "Writing" },
];

const AddSubjectPage = () => {
  const params = useParams();
  const router = useRouter();
  const classroomId = params?.id as string;

  const [name, setName] = useState("");
  const [selectedCover, setSelectedCover] = useState(DEMO_COVERS[0].url);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toast.error("Please enter a subject name");

    setLoading(true);
    const result = await createSubjectAction({
      name,
      classroomId,
      coverImage: selectedCover,
    });

    if (result.success) {
      toast.success("Subject created!");
      router.push(`/dashboard/classroom/${classroomId}`);
    } else {
      toast.error(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        
        {/* Navigation */}
        <Link 
          href={`/dashboard/classroom/${classroomId}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-orange-500 transition-colors mb-8 group w-fit"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-bold text-sm underline decoration-transparent group-hover:decoration-orange-500">Back to Classroom</span>
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs font-black uppercase tracking-widest">New Entry</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight italic">
            Add <span className="text-orange-500">Subject</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Create a new subject for this classroom.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Name Input */}
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
              Subject Name
            </label>
            <Input
              placeholder="Enter subject name (e.g. Physics)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-16 rounded-[1.5rem] border-2 border-border bg-card/50 px-6 text-xl font-bold focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all"
              required
            />
          </div>

          {/* Cover Image Picker */}
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2">
              <ImageIcon className="h-3 w-3" /> Select Theme Cover
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {DEMO_COVERS.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedCover(item.url)}
                  className={`group relative aspect-[4/3] rounded-[1.5rem] overflow-hidden cursor-pointer border-4 transition-all duration-300 active:scale-95 ${
                    selectedCover === item.url 
                      ? "border-orange-500 shadow-xl shadow-orange-500/20" 
                      : "border-transparent grayscale hover:grayscale-0 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={item.url} alt={item.label} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                  
                  {selectedCover === item.url && (
                    <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center">
                      <div className="bg-orange-500 text-white p-1.5 rounded-full shadow-lg">
                        <Check className="h-5 w-5 stroke-[3px]" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Submit Button */}
          <Button 
            type="submit"
            disabled={loading}
            className="w-full rounded-[1.5rem] font-black h-16 text-lg bg-orange-500 hover:bg-orange-600 shadow-2xl shadow-orange-500/30 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                Processing...
              </>
            ) : (
              "Create Subject"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectPage;
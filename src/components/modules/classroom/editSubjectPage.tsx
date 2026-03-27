"use client";

import { getSubjectById } from "@/services/createsubject.service";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Loader2,
    ArrowLeft,
    BookOpen,
    Check,
    Image as ImageIcon,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Server Actions are okay to import in Client Components
import { updateSubjectAction } from "@/app/(dashboardLayout)/dashboard/classroom/subject/[id]/add/_action";

const DEMO_COVERS = [
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80",
    "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=800&q=80",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
];

const EditSubjectPage = () => {
    const params = useParams();
    const router = useRouter();

    // Note: useParams returns the key based on your folder name [id]
    const subjectId = params?.id as string;

    const [name, setName] = useState("");
    const [selectedCover, setSelectedCover] = useState("");
    const [classroomId, setClassroomId] = useState("");
    const [fetching, setFetching] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchSubjectData = useCallback(async () => {
        if (!subjectId) return;
        try {
            const response = await getSubjectById(subjectId);

            if (response.success) {
                const subject = response.data;
                setName(subject.name);
                setSelectedCover(subject.coverImage || DEMO_COVERS[0]);
                setClassroomId(subject.classroomId);
            } else {
                toast.error("Subject not found");
                router.back();
            }
        } finally {
            setFetching(false);
        }
    }, [subjectId, router]);

    useEffect(() => {
        fetchSubjectData();
    }, [fetchSubjectData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Name is required");

        setUpdating(true);
        try {
            const result = await updateSubjectAction(
                subjectId,
                { name, coverImage: selectedCover },
                classroomId
            );

            if (result.success) {
                toast.success("Subject updated successfully!");
                router.refresh(); // Optional: trigger server sync
                router.back();
            } else {
                toast.error(result.error || "Update failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setUpdating(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
                <p className="mt-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground animate-pulse">
                    Syncing Details...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6 md:p-10">
            <div className="mx-auto max-w-2xl">

                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-orange-500 transition-colors mb-8 group w-fit"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span className="font-bold text-sm">Cancel & Go Back</span>
                </button>

                <header className="mb-10">
                    <div className="flex items-center gap-2 text-orange-500 mb-2">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-xs font-black uppercase tracking-widest text-orange-500/80">Editor</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic">
                        Edit <span className="text-orange-500">Subject</span>
                    </h1>
                </header>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Subject Name
                        </label>
                        <Input
                            placeholder="e.g. Mathematics"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-16 rounded-[1.5rem] border-2 border-border bg-card/50 px-6 text-xl font-bold focus-visible:ring-orange-500/20 shadow-inner"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                            <ImageIcon className="h-3 w-3" /> Select Cover Theme
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {DEMO_COVERS.map((url, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedCover(url)}
                                    className={`relative aspect-[4/3] rounded-[1.5rem] overflow-hidden cursor-pointer border-4 transition-all duration-300 ${selectedCover === url
                                            ? "border-orange-500 shadow-xl shadow-orange-500/20"
                                            : "border-transparent grayscale hover:grayscale-0 opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <img src={url} alt="Cover" className="object-cover w-full h-full" />
                                    {selectedCover === url && (
                                        <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center">
                                            <div className="bg-orange-500 text-white p-1 rounded-full shadow-lg">
                                                <Check className="h-4 w-4 stroke-[3px]" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={updating}
                        className="w-full rounded-[1.5rem] font-black h-16 text-lg bg-orange-500 hover:bg-orange-600 shadow-2xl shadow-orange-500/30 transition-all active:scale-[0.98]"
                    >
                        {updating ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                <Save className="h-5 w-5" /> Save Changes
                            </span>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EditSubjectPage;
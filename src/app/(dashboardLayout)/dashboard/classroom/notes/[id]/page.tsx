import { getCurrentUserAction } from "@/actions/_getCurrentUserAction";
import { getNoteByIdAction } from "@/actions/_notedetailactions";
import NoteDetailPage from "@/components/modules/Notes/NotesDetailsPage/Notedetailpage";

type NotePageProps = {
  params: Promise<{ id: string }>;
};

const NotePage = async ({ params }: NotePageProps) => {
  const { id } = await params;
  const userResult = await getCurrentUserAction();
  const noteResult = await getNoteByIdAction(id);
  const currentUser = userResult.success
    ? {
        id: userResult.data.id,
        name: userResult.data.name,
        image: userResult.data.image,
        role: userResult.data.role,
      }
    : undefined;

  return (
    <NoteDetailPage
      initialNote={noteResult.success ? noteResult.data : undefined}
      initialError={noteResult.success ? null : noteResult.error}
      currentUser={currentUser}
    />
  );
};

export default NotePage;

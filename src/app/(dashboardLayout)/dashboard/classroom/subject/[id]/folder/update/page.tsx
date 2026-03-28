import { UpdateFolderModal } from "@/components/modules/classroom/classroomSubjectFolderPage/updateFolderaddModal";

const UpdateFolderPage = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            <UpdateFolderModal 
                folderId="" 
                subjectId={params.id} 
                isOpen={true} 
                onClose={() => {}} 
            />
        </div>
    );
};

export default UpdateFolderPage;
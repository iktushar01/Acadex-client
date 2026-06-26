import { Suspense } from "react";
import SupportSuccessContent from "./SupportSuccessContent";

export default function SupportSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SupportSuccessContent />
    </Suspense>
  );
}

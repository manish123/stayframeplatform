import { Button } from "@/components/ui/Button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-yellow-800">
          Feedback Not Found
        </h2>
        <p className="mt-2 text-sm text-yellow-700">
          The feedback you're looking for doesn't exist or has been deleted.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/feedback" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Feedback
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

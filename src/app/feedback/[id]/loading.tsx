import { Skeleton } from "@/components/ui/skeleton";

export default function FeedbackDetailLoading() {
  return (
    <div className="container mx-auto p-6">
      <Skeleton className="mb-6 h-8 w-32" />
      
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="h-10 w-96" />
            <div className="mt-4 flex space-x-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border bg-card">
              <div className="border-b p-4">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="p-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-3/4" />
                <Skeleton className="mt-4 h-64 w-full" />
              </div>
            </div>

            <div className="rounded-lg border bg-card">
              <div className="border-b p-4">
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="ml-3">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="mt-1 h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="mt-2 h-4 w-full" />
                    <Skeleton className="mt-1 h-4 w-5/6" />
                  </div>
                ))}
                
                <div className="mt-6">
                  <Skeleton className="h-10 w-40 mb-2" />
                  <Skeleton className="h-24 w-full" />
                  <div className="mt-2 flex justify-end">
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <Skeleton className="mb-4 h-6 w-24" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-32" />
                  <div className="mt-2 flex items-center">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="ml-2 h-4 w-32" />
                  </div>
                  <Skeleton className="mt-1 h-4 w-48" />
                </div>
                <div>
                  <Skeleton className="h-4 w-32" />
                  <div className="mt-2 flex items-center">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="ml-2 h-4 w-48" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-40" />
                  <div className="mt-2 flex items-center">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="ml-2 h-4 w-48" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-48" />
                  <div className="mt-2 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <Skeleton className="mb-4 h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-4 h-10 w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

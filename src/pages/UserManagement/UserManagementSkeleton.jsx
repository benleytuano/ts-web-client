import { Skeleton } from "@/components/ui/skeleton";

export default function UserManagementSkeleton() {
  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
        <div>
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Stats - Compact */}
      <div className="py-2 bg-white border-b border-gray-200 flex-shrink-0 mt-2">
        <div className="px-6 grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-6 w-12 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="py-2 bg-white border-b border-gray-200 flex-shrink-0 mt-2">
        <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Skeleton className="h-10 lg:col-span-2" />
          <Skeleton className="h-10" />
        </div>
      </div>

      {/* Users Table */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white mt-2">
        <div className="relative w-full max-h-full overflow-y-auto">
          {/* Table Header */}
          <div className="bg-white sticky top-0 z-10">
            <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-gray-50/50 border-b border-gray-200">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16 ml-auto" />
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50/50">
                {/* User Cell */}
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>

                {/* Role Cell */}
                <div>
                  <Skeleton className="h-6 w-24" />
                </div>

                {/* Department Cell */}
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>

                {/* Actions Cell */}
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white flex-shrink-0 mt-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>

            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-8" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


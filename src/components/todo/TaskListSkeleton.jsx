import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TEXTS } from "@/lib/texts";

export default function TaskListSkeleton() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="filter" className="text-sm text-muted-foreground">
            {TEXTS.TASK_LIST.CATEGORY_FILTER_LABEL}
          </label>
          <Skeleton className="h-9 w-32" /> {/* Category select */}
          <Skeleton className="h-9 w-9" /> {/* Refresh button */}
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-12" /> {/* Total stats */}
          <Skeleton className="h-4 w-12" /> {/* Done stats */}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y">
          {Array.from({ length: 1 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-4" /> {/* Checkbox */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" /> {/* Task title */}
                  <Skeleton className="h-3 w-24" /> {/* Category name */}
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded" /> {/* Delete icon */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

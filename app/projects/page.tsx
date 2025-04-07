"use client"
import { useRouter } from "next/navigation"
import ProjectManagement from "@/project-management"
import { Button } from "@/components/ui/button"
import { BarChart3, LineChart } from "lucide-react"

export default function ProjectsPage() {
  const router = useRouter()

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
          <p className="text-muted-foreground">Track milestones and progress across all sites</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/projects/progress")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            View Progress
          </Button>
          <Button variant="outline" onClick={() => router.push("/projects/gantt")}>
            <LineChart className="mr-2 h-4 w-4" />
            View Gantt Chart
          </Button>
        </div>
      </div>

      <ProjectManagement />
    </>
  )
}


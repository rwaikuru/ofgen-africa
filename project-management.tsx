"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle2, Clock, Filter, PlusCircle, Search, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LineChart } from "@/components/ui/chart"
import DashboardLayout from "./dashboard-layout"

// Define types for our data
type ProjectStatus = "Planned" | "In Progress" | "On Hold" | "Completed"

type Milestone = {
  id: string
  title: string
  description: string
  dueDate: string
  completedDate?: string
  status: "Pending" | "In Progress" | "Completed" | "Delayed"
}

type Project = {
  id: string
  name: string
  location: string
  county: string
  capacity: string
  status: ProjectStatus
  startDate: string
  targetCompletionDate: string
  actualCompletionDate?: string
  progress: number
  milestones: Milestone[]
}

// Mock data for projects
const generateMockProjects = (): Project[] => {
  const counties = [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Kiambu",
    "Uasin Gishu",
    "Meru",
    "Kakamega",
    "Kilifi",
    "Machakos",
  ]

  const statuses: ProjectStatus[] = ["Planned", "In Progress", "On Hold", "Completed"]

  const generateMilestones = (projectId: string): Milestone[] => {
    const milestoneCount = 3 + Math.floor(Math.random() * 3) // 3-5 milestones
    const milestones: Milestone[] = []

    const milestoneTemplates = [
      { title: "Site Assessment", description: "Initial site assessment and feasibility study" },
      { title: "Permit Acquisition", description: "Obtain necessary permits and approvals" },
      { title: "Material Procurement", description: "Procure solar panels and other equipment" },
      { title: "Installation Start", description: "Begin installation of mounting structures and panels" },
      { title: "Electrical Work", description: "Complete electrical wiring and connections" },
      { title: "Testing", description: "System testing and quality assurance" },
      { title: "Grid Connection", description: "Connect system to the grid and finalize" },
      { title: "Handover", description: "Final inspection and client handover" },
    ]

    for (let i = 0; i < milestoneCount; i++) {
      const template = milestoneTemplates[i]
      const today = new Date()
      const dueDate = new Date(today)
      dueDate.setDate(today.getDate() + i * 14 + Math.floor(Math.random() * 10))

      const status: Milestone["status"] =
        i === 0
          ? "Completed"
          : i === 1
            ? "In Progress"
            : i === 2
              ? Math.random() > 0.5
                ? "Pending"
                : "Delayed"
              : "Pending"

      milestones.push({
        id: `${projectId}-m${i}`,
        title: template.title,
        description: template.description,
        dueDate: dueDate.toISOString().split("T")[0],
        completedDate:
          status === "Completed"
            ? new Date(dueDate.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 10).toISOString().split("T")[0]
            : undefined,
        status: status,
      })
    }

    return milestones
  }

  const projects: Project[] = []

  for (let i = 0; i < 500; i++) {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - Math.floor(Math.random() * 90))

    const targetCompletionDate = new Date(startDate)
    targetCompletionDate.setDate(startDate.getDate() + 90 + Math.floor(Math.random() * 60))

    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const progress =
      status === "Planned"
        ? Math.floor(Math.random() * 10)
        : status === "In Progress"
          ? 10 + Math.floor(Math.random() * 70)
          : status === "On Hold"
            ? 10 + Math.floor(Math.random() * 60)
            : 100

    const county = counties[Math.floor(Math.random() * counties.length)]
    const locations = [
      `${county} North`,
      `${county} South`,
      `${county} East`,
      `${county} West`,
      `${county} Central`,
      `New ${county}`,
    ]

    const project: Project = {
      id: `OFGEN-${1000 + i}`,
      name: `${county} Solar Project ${(i % 10) + 1}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      county: county,
      capacity: `${(Math.random() * 9 + 1).toFixed(2)} kW`,
      status: status,
      startDate: startDate.toISOString().split("T")[0],
      targetCompletionDate: targetCompletionDate.toISOString().split("T")[0],
      actualCompletionDate:
        status === "Completed"
          ? new Date(targetCompletionDate.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 14)
              .toISOString()
              .split("T")[0]
          : undefined,
      progress: progress,
      milestones: generateMilestones(`OFGEN-${1000 + i}`),
    }

    projects.push(project)
  }

  return projects
}

const mockProjects = generateMockProjects()

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(mockProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [countyFilter, setCountyFilter] = useState<string>("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isAddingMilestone, setIsAddingMilestone] = useState(false)
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
  })

  const projectsPerPage = 10
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const indexOfLastProject = currentPage * projectsPerPage
  const indexOfFirstProject = indexOfLastProject - projectsPerPage
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject)

  // Get unique counties for filtering
  const counties = Array.from(new Set(projects.map((project) => project.county)))

  // Filter projects based on search term and filters
  const filterProjects = () => {
    let filtered = [...projects]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(term) ||
          project.id.toLowerCase().includes(term) ||
          project.location.toLowerCase().includes(term),
      )
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((project) => project.status === statusFilter)
    }

    if (countyFilter !== "All") {
      filtered = filtered.filter((project) => project.county === countyFilter)
    }

    setFilteredProjects(filtered)
    setCurrentPage(1)
  }

  // Apply filters when search or filters change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    filterProjects()
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    setTimeout(filterProjects, 0)
  }

  const handleCountyFilter = (value: string) => {
    setCountyFilter(value)
    setTimeout(filterProjects, 0)
  }

  // Handle milestone submission
  const handleSubmitMilestone = () => {
    if (!selectedProject || !newMilestone.title || !newMilestone.dueDate) return

    const updatedMilestone: Milestone = {
      id: `${selectedProject.id}-m${selectedProject.milestones.length + 1}`,
      title: newMilestone.title || "",
      description: newMilestone.description || "",
      dueDate: newMilestone.dueDate || "",
      status: (newMilestone.status as Milestone["status"]) || "Pending",
    }

    // Create a deep copy of the selected project with the new milestone
    const updatedProject = {
      ...selectedProject,
      milestones: [...selectedProject.milestones, updatedMilestone],
    }

    // Update the projects array
    const updatedProjects = projects.map((p) => (p.id === selectedProject.id ? updatedProject : p))

    setProjects(updatedProjects)
    setFilteredProjects(updatedProjects)
    setSelectedProject(updatedProject)
    setNewMilestone({
      title: "",
      description: "",
      dueDate: "",
      status: "Pending",
    })
    setIsAddingMilestone(false)
  }

  // Handle milestone status update
  const updateMilestoneStatus = (projectId: string, milestoneId: string, newStatus: Milestone["status"]) => {
    const updatedProjects = projects.map((project) => {
      if (project.id !== projectId) return project

      const updatedMilestones = project.milestones.map((milestone) => {
        if (milestone.id !== milestoneId) return milestone

        return {
          ...milestone,
          status: newStatus,
          completedDate: newStatus === "Completed" ? new Date().toISOString().split("T")[0] : undefined,
        }
      })

      // Calculate new progress based on completed milestones
      const completedMilestones = updatedMilestones.filter((m) => m.status === "Completed").length
      const newProgress = Math.round((completedMilestones / updatedMilestones.length) * 100)

      return {
        ...project,
        milestones: updatedMilestones,
        progress: newProgress,
        status: newProgress === 100 ? "Completed" : project.status,
      }
    })

    setProjects(updatedProjects)
    setFilteredProjects(updatedProjects)

    // Update selected project if it's the one being modified
    if (selectedProject && selectedProject.id === projectId) {
      const updatedProject = updatedProjects.find((p) => p.id === projectId)
      if (updatedProject) setSelectedProject(updatedProject)
    }
  }

  // Statistics for the dashboard
  const statistics = {
    total: projects.length,
    completed: projects.filter((p) => p.status === "Completed").length,
    inProgress: projects.filter((p) => p.status === "In Progress").length,
    planned: projects.filter((p) => p.status === "Planned").length,
    onHold: projects.filter((p) => p.status === "On Hold").length,
    averageProgress: Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length),
  }

  // Generate chart data for progress by county
  const progressByCounty = counties.map((county) => {
    const countyProjects = projects.filter((p) => p.county === county)
    const averageProgress = countyProjects.reduce((sum, p) => sum + p.progress, 0) / countyProjects.length

    return {
      name: county,
      value: Math.round(averageProgress),
    }
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
          <p className="text-muted-foreground">
            Track and manage solar installation projects and milestones across all sites
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total}</div>
              <p className="text-xs text-muted-foreground">Across {counties.length} counties</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statistics.completed}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((statistics.completed / statistics.total) * 100)}% of all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statistics.inProgress}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((statistics.inProgress / statistics.total) * 100)}% of all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Planned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statistics.planned}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((statistics.planned / statistics.total) * 100)}% of all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.averageProgress}%</div>
              <Progress value={statistics.averageProgress} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Project Management Tabs */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Project List</TabsTrigger>
            <TabsTrigger value="analytics">Progress Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search projects by name, ID, or location..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Select value={statusFilter} onValueChange={handleStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="All">All Statuses</SelectItem>
                          <SelectItem value="Planned">Planned</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Select value={countyFilter} onValueChange={handleCountyFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by county" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>County</SelectLabel>
                          <SelectItem value="All">All Counties</SelectItem>
                          {counties.map((county) => (
                            <SelectItem key={county} value={county}>
                              {county}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Filter className="mr-2 h-4 w-4" />
                          More Filters
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Advanced Filters</DialogTitle>
                          <DialogDescription>Filter projects by various criteria</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="progress" className="col-span-4">
                              Minimum Progress
                            </Label>
                            <div className="col-span-4">
                              <div className="flex items-center gap-4">
                                <Input id="progress" type="range" min="0" max="100" />
                                <span>0%</span>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date-from" className="col-span-4">
                              Start Date Range
                            </Label>
                            <Input id="date-from" type="date" className="col-span-2" placeholder="From" />
                            <Input id="date-to" type="date" className="col-span-2" placeholder="To" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Reset</Button>
                          <Button>Apply Filters</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project ID</TableHead>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Target Completion</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProjects.length > 0 ? (
                      currentProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.id}</TableCell>
                          <TableCell>{project.name}</TableCell>
                          <TableCell>{project.location}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                project.status === "Completed"
                                  ? "bg-green-600"
                                  : project.status === "In Progress"
                                    ? "bg-blue-600"
                                    : project.status === "On Hold"
                                      ? "bg-amber-600"
                                      : "bg-slate-600"
                              }
                            >
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={project.progress} className="h-2 w-[60px]" />
                              <span className="text-xs">{project.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{project.targetCompletionDate}</TableCell>
                          <TableCell className="text-right">
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedProject(project)}>
                                  View Details
                                </Button>
                              </SheetTrigger>
                              <SheetContent side="right" className="w-full sm:w-[540px] sm:max-w-md">
                                {selectedProject && (
                                  <>
                                    <SheetHeader>
                                      <SheetTitle>Project Details</SheetTitle>
                                      <SheetDescription>
                                        {selectedProject.id} - {selectedProject.name}
                                      </SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="text-sm font-semibold">Status</h4>
                                          <Badge
                                            className={
                                              selectedProject.status === "Completed"
                                                ? "bg-green-600"
                                                : selectedProject.status === "In Progress"
                                                  ? "bg-blue-600"
                                                  : selectedProject.status === "On Hold"
                                                    ? "bg-amber-600"
                                                    : "bg-slate-600"
                                            }
                                          >
                                            {selectedProject.status}
                                          </Badge>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-semibold">Progress</h4>
                                          <div className="flex items-center gap-2 mt-1">
                                            <Progress value={selectedProject.progress} className="h-2 w-[100px]" />
                                            <span>{selectedProject.progress}%</span>
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-semibold">Location</h4>
                                          <p className="text-sm text-muted-foreground">
                                            {selectedProject.location}, {selectedProject.county}
                                          </p>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-semibold">Capacity</h4>
                                          <p className="text-sm text-muted-foreground">{selectedProject.capacity}</p>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-semibold">Start Date</h4>
                                          <p className="text-sm text-muted-foreground">{selectedProject.startDate}</p>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-semibold">Target Completion</h4>
                                          <p className="text-sm text-muted-foreground">
                                            {selectedProject.targetCompletionDate}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Milestones Section */}
                                      <div>
                                        <div className="flex items-center justify-between mb-4">
                                          <h3 className="text-lg font-semibold">Milestones</h3>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsAddingMilestone(true)}
                                          >
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Add Milestone
                                          </Button>
                                        </div>

                                        {isAddingMilestone ? (
                                          <Card className="mb-4">
                                            <CardHeader>
                                              <CardTitle className="text-sm">Add New Milestone</CardTitle>
                                              <CardDescription>Create a new milestone for this project</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                              <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                  <Label htmlFor="title">Title</Label>
                                                  <Input
                                                    id="title"
                                                    value={newMilestone.title}
                                                    onChange={(e) =>
                                                      setNewMilestone({ ...newMilestone, title: e.target.value })
                                                    }
                                                  />
                                                </div>
                                                <div className="grid gap-2">
                                                  <Label htmlFor="description">Description</Label>
                                                  <Textarea
                                                    id="description"
                                                    value={newMilestone.description}
                                                    onChange={(e) =>
                                                      setNewMilestone({ ...newMilestone, description: e.target.value })
                                                    }
                                                  />
                                                </div>
                                                <div className="grid gap-2">
                                                  <Label htmlFor="due-date">Due Date</Label>
                                                  <Input
                                                    id="due-date"
                                                    type="date"
                                                    value={newMilestone.dueDate}
                                                    onChange={(e) =>
                                                      setNewMilestone({ ...newMilestone, dueDate: e.target.value })
                                                    }
                                                  />
                                                </div>
                                                <div className="grid gap-2">
                                                  <Label htmlFor="status">Status</Label>
                                                  <Select
                                                    value={newMilestone.status}
                                                    onValueChange={(value) =>
                                                      setNewMilestone({
                                                        ...newMilestone,
                                                        status: value as Milestone["status"],
                                                      })
                                                    }
                                                  >
                                                    <SelectTrigger id="status">
                                                      <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="Pending">Pending</SelectItem>
                                                      <SelectItem value="In Progress">In Progress</SelectItem>
                                                      <SelectItem value="Completed">Completed</SelectItem>
                                                      <SelectItem value="Delayed">Delayed</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                            </CardContent>
                                            <CardFooter className="flex justify-between">
                                              <Button variant="outline" onClick={() => setIsAddingMilestone(false)}>
                                                Cancel
                                              </Button>
                                              <Button onClick={handleSubmitMilestone}>Add Milestone</Button>
                                            </CardFooter>
                                          </Card>
                                        ) : null}

                                        <ScrollArea className="h-[400px] pr-4">
                                          <div className="space-y-4">
                                            {selectedProject.milestones.map((milestone) => (
                                              <Card key={milestone.id} className="relative">
                                                <CardHeader className="pb-2">
                                                  <div className="flex items-center justify-between">
                                                    <div>
                                                      <CardTitle className="text-sm font-medium">
                                                        {milestone.title}
                                                      </CardTitle>
                                                      <CardDescription>
                                                        Due: {milestone.dueDate}
                                                        {milestone.completedDate && (
                                                          <> · Completed: {milestone.completedDate}</>
                                                        )}
                                                      </CardDescription>
                                                    </div>
                                                    <Badge
                                                      className={
                                                        milestone.status === "Completed"
                                                          ? "bg-green-600"
                                                          : milestone.status === "In Progress"
                                                            ? "bg-blue-600"
                                                            : milestone.status === "Delayed"
                                                              ? "bg-red-600"
                                                              : "bg-slate-600"
                                                      }
                                                    >
                                                      {milestone.status}
                                                    </Badge>
                                                  </div>
                                                </CardHeader>
                                                <CardContent>
                                                  <p className="text-sm text-muted-foreground">
                                                    {milestone.description}
                                                  </p>
                                                </CardContent>
                                                <CardFooter className="flex justify-end gap-2">
                                                  {milestone.status !== "Completed" && (
                                                    <Button
                                                      variant="outline"
                                                      size="sm"
                                                      onClick={() =>
                                                        updateMilestoneStatus(
                                                          selectedProject.id,
                                                          milestone.id,
                                                          "Completed",
                                                        )
                                                      }
                                                    >
                                                      <CheckCircle2 className="mr-1 h-3 w-3" />
                                                      Mark Complete
                                                    </Button>
                                                  )}
                                                  {milestone.status === "Pending" && (
                                                    <Button
                                                      variant="outline"
                                                      size="sm"
                                                      onClick={() =>
                                                        updateMilestoneStatus(
                                                          selectedProject.id,
                                                          milestone.id,
                                                          "In Progress",
                                                        )
                                                      }
                                                    >
                                                      <Clock className="mr-1 h-3 w-3" />
                                                      Start
                                                    </Button>
                                                  )}
                                                  {milestone.status === "In Progress" && (
                                                    <Button
                                                      variant="outline"
                                                      size="sm"
                                                      onClick={() =>
                                                        updateMilestoneStatus(
                                                          selectedProject.id,
                                                          milestone.id,
                                                          "Delayed",
                                                        )
                                                      }
                                                    >
                                                      <XCircle className="mr-1 h-3 w-3" />
                                                      Mark Delayed
                                                    </Button>
                                                  )}
                                                </CardFooter>
                                              </Card>
                                            ))}
                                          </div>
                                        </ScrollArea>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </SheetContent>
                            </Sheet>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No projects found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="border-t p-2">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Showing {indexOfFirstProject + 1}-{Math.min(indexOfLastProject, filteredProjects.length)} of{" "}
                    {filteredProjects.length} projects
                  </p>
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show pages around the current page
                      let pageNum = i + 1
                      if (totalPages > 5) {
                        if (currentPage > 3) {
                          pageNum = currentPage - 3 + i
                        }
                        if (pageNum > totalPages - 4 && currentPage > totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        }
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink onClick={() => setCurrentPage(pageNum)} isActive={currentPage === pageNum}>
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Progress by County</CardTitle>
                  <CardDescription>Average project completion percentage by county</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <LineChart data={progressByCounty} xAxis="name" yAxis="value" height={400} colors={["#16a34a"]} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Status Distribution</CardTitle>
                  <CardDescription>Number of projects by status category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <div className="flex flex-col h-full justify-center">
                      <div className="space-y-8">
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-green-600"></div>
                              <span>Completed</span>
                            </div>
                            <span className="font-medium">{statistics.completed}</span>
                          </div>
                          <Progress value={(statistics.completed / statistics.total) * 100} className="h-2 mt-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                              <span>In Progress</span>
                            </div>
                            <span className="font-medium">{statistics.inProgress}</span>
                          </div>
                          <Progress value={(statistics.inProgress / statistics.total) * 100} className="h-2 mt-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
                              <span>Planned</span>
                            </div>
                            <span className="font-medium">{statistics.planned}</span>
                          </div>
                          <Progress value={(statistics.planned / statistics.total) * 100} className="h-2 mt-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-amber-600"></div>
                              <span>On Hold</span>
                            </div>
                            <span className="font-medium">{statistics.onHold}</span>
                          </div>
                          <Progress value={(statistics.onHold / statistics.total) * 100} className="h-2 mt-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Milestone Updates</CardTitle>
                <CardDescription>Recently updated project milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Milestone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated Date</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* This would typically be populated with real data - showing mock data for now */}
                    {[1, 2, 3, 4, 5].map((_, i) => {
                      const project = projects[i * 10]
                      const milestone = project.milestones[0]
                      return (
                        <TableRow key={i}>
                          <TableCell>{project.name}</TableCell>
                          <TableCell>{milestone.title}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                milestone.status === "Completed"
                                  ? "bg-green-600"
                                  : milestone.status === "In Progress"
                                    ? "bg-blue-600"
                                    : milestone.status === "Delayed"
                                      ? "bg-red-600"
                                      : "bg-slate-600"
                              }
                            >
                              {milestone.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{milestone.completedDate || milestone.dueDate}</TableCell>
                          <TableCell>{project.location}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}


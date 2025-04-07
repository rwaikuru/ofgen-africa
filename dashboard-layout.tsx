"use client"

import type React from "react"

import { useState } from "react"
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronDown,
  Cog,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  MapPin,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  SunMedium,
  Users,
  User,
  Package,
  Wrench,
  ClipboardList,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { setTheme, theme } = useTheme()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 pr-0">
              <div className="flex items-center gap-2 px-2">
                <SunMedium className="h-6 w-6 text-yellow-500" />
                <span className="text-lg font-bold">Ofgen Solar</span>
              </div>
              <Separator className="my-4" />
              <MobileNav />
            </SheetContent>
          </Sheet>
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <SunMedium className="h-6 w-6 text-yellow-500" />
            <span className="text-lg font-bold">Ofgen Solar</span>
          </div>
        </div>

        {/* Navigation Menu Items */}
        <div className="hidden md:flex items-center ml-6 space-x-1">
          <Link href="/">
            <Button variant="ghost">Dashboard</Button>
          </Link>

          {/* Projects Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                Projects
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <Link href="/projects">
                <DropdownMenuItem>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Project Overview</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/projects/progress">
                <DropdownMenuItem>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>Project Progress</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/projects/gantt">
                <DropdownMenuItem>
                  <LineChart className="mr-2 h-4 w-4" />
                  <span>Gantt Chart</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/sites">
            <Button variant="ghost">Sites</Button>
          </Link>

          <Link href="/inventory">
            <Button variant="ghost">Inventory</Button>
          </Link>

          <Link href="/service-orders">
            <Button variant="ghost">Service Orders</Button>
          </Link>

          <Link href="/reports">
            <Button variant="ghost">Reports</Button>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <form className="hidden md:flex">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search installations..." className="w-64 pl-8 bg-background" />
            </div>
          </form>

          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-600 text-white">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john.doe@ofgen.co.ke</p>
                </div>
              </div>
              <Separator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside
          className={cn(
            "fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "md:translate-x-0",
            !sidebarOpen && "md:w-16",
          )}
        >
          <nav className="grid gap-2 p-4">
            <NavItem href="/" icon={<LayoutDashboard />} label="Dashboard" active collapsed={!sidebarOpen} />

            {/* Updated sidebar navigation items with nested project items */}
            <NavGroupItem
              icon={<LayoutDashboard />}
              label="Projects"
              collapsed={!sidebarOpen}
              subitems={[
                { href: "/projects", label: "Overview" },
                { href: "/projects/progress", label: "Progress" },
                { href: "/projects/gantt", label: "Gantt Chart" },
              ]}
            />

            <NavItem href="/sites" icon={<MapPin />} label="Installation Sites" collapsed={!sidebarOpen} />

            <NavItem href="/inventory" icon={<Package />} label="Inventory" collapsed={!sidebarOpen} />

            <NavItem href="/service-orders" icon={<Wrench />} label="Service Orders" collapsed={!sidebarOpen} />

            <NavItem href="/reports" icon={<ClipboardList />} label="Reports" collapsed={!sidebarOpen} />

            <NavItem href="/alerts" icon={<Bell />} label="Alerts" badge="5" collapsed={!sidebarOpen} />

            <NavItem href="/maintenance" icon={<Calendar />} label="Maintenance" collapsed={!sidebarOpen} />

            <NavItem href="/teams" icon={<Users />} label="Teams" collapsed={!sidebarOpen} />

            <NavItem href="/users" icon={<UserIcon />} label="Users" collapsed={!sidebarOpen} />

            <Separator className="my-2" />

            <NavItem href="/help" icon={<HelpCircle />} label="Help & Support" collapsed={!sidebarOpen} />
            <NavItem href="/settings" icon={<Cog />} label="Settings" collapsed={!sidebarOpen} />
          </nav>

          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className={cn("rounded-lg bg-green-50 dark:bg-green-900/20 p-4", !sidebarOpen && "p-2")}>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-600 p-1.5 text-white">
                  <SunMedium className={cn("h-5 w-5", !sidebarOpen && "h-4 w-4")} />
                </div>
                {sidebarOpen && (
                  <div>
                    <p className="text-sm font-medium">Energy Saved</p>
                    <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={cn("flex-1 transition-all", sidebarOpen ? "md:ml-64" : "md:ml-16")}>
          <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

function NavItem({
  href,
  icon,
  label,
  badge,
  active = false,
  collapsed = false,
}: {
  href: string
  icon: React.ReactNode
  label: string
  badge?: string
  active?: boolean
  collapsed?: boolean
}) {
  return (
    <Link href={href}>
      <Button
        variant={active ? "secondary" : "ghost"}
        className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}
      >
        <span className={cn("mr-2", collapsed && "mr-0")}>{icon}</span>
        {!collapsed && <span>{label}</span>}
        {!collapsed && badge && (
          <Badge variant="secondary" className="ml-auto">
            {badge}
          </Badge>
        )}
        {collapsed && badge && (
          <Badge
            variant="secondary"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
          >
            {badge}
          </Badge>
        )}
      </Button>
    </Link>
  )
}

function NavGroupItem({
  icon,
  label,
  collapsed = false,
  subitems = [],
}: {
  icon: React.ReactNode
  label: string
  collapsed?: boolean
  subitems: { href: string; label: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}
        onClick={() => !collapsed && setIsOpen(!isOpen)}
      >
        <span className={cn("mr-2", collapsed && "mr-0")}>{icon}</span>
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{label}</span>
            <ChevronDown className={cn("h-4 w-4 transition-all", isOpen && "rotate-180")} />
          </>
        )}
      </Button>

      {!collapsed && isOpen && (
        <div className="pl-8 space-y-1">
          {subitems.map((item, index) => (
            <Link href={item.href} key={index}>
              <Button variant="ghost" className="w-full justify-start h-8 text-sm">
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileNav() {
  return (
    <nav className="grid gap-2 px-2">
      <Link href="/">
        <Button variant="secondary" className="w-full justify-start">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <div className="flex items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Projects
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <Link href="/projects">
            <DropdownMenuItem>Overview</DropdownMenuItem>
          </Link>
          <Link href="/projects/progress">
            <DropdownMenuItem>Progress</DropdownMenuItem>
          </Link>
          <Link href="/projects/gantt">
            <DropdownMenuItem>Gantt Chart</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link href="/sites">
        <Button variant="ghost" className="w-full justify-start">
          <MapPin className="mr-2 h-4 w-4" />
          Installation Sites
        </Button>
      </Link>

      <Link href="/inventory">
        <Button variant="ghost" className="w-full justify-start">
          <Package className="mr-2 h-4 w-4" />
          Inventory
        </Button>
      </Link>

      <Link href="/service-orders">
        <Button variant="ghost" className="w-full justify-start">
          <Wrench className="mr-2 h-4 w-4" />
          Service Orders
        </Button>
      </Link>

      <Link href="/alerts">
        <Button variant="ghost" className="w-full justify-start">
          <Bell className="mr-2 h-4 w-4" />
          Alerts
          <Badge variant="secondary" className="ml-auto">
            5
          </Badge>
        </Button>
      </Link>

      <Link href="/maintenance">
        <Button variant="ghost" className="w-full justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          Maintenance
        </Button>
      </Link>

      <Link href="/teams">
        <Button variant="ghost" className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" />
          Teams
        </Button>
      </Link>

      <Link href="/users">
        <Button variant="ghost" className="w-full justify-start">
          <User className="mr-2 h-4 w-4" />
          Users
        </Button>
      </Link>

      <Separator className="my-2" />

      <Link href="/help">
        <Button variant="ghost" className="w-full justify-start">
          <HelpCircle className="mr-2 h-4 w-4" />
          Help & Support
        </Button>
      </Link>

      <Link href="/settings">
        <Button variant="ghost" className="w-full justify-start">
          <Cog className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </Link>
    </nav>
  )
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function LogOut(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}


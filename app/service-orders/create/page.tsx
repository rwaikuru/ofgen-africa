"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, CalendarIcon, Save, Search, Plus, Trash2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

// Define site type
type Site = {
  id: string
  name: string
  county: string
  address: string
}

// Define technician type
type Technician = {
  id: string
  name: string
  specialization: string
  availability: boolean
}

// Define inventory item type
type InventoryItem = {
  id: string
  name: string
  category: string
  unitCost: number // Selling price
  buyingPrice: number // Buying price
  quantity: number
}

// Mock sites data
const MOCK_SITES: Site[] = [
  { id: "SITE-1001", name: "Nairobi Solar Site 1", county: "Nairobi", address: "123 Solar Avenue, Nairobi" },
  { id: "SITE-1002", name: "Mombasa Solar Site 1", county: "Mombasa", address: "45 Beach Road, Mombasa" },
  { id: "SITE-1003", name: "Kisumu Solar Site 1", county: "Kisumu", address: "78 Lake Street, Kisumu" },
  { id: "SITE-1004", name: "Nakuru Solar Site 1", county: "Nakuru", address: "90 Crater Road, Nakuru" },
  { id: "SITE-1005", name: "Eldoret Solar Site 1", county: "Uasin Gishu", address: "12 Highland Avenue, Eldoret" },
]

// Mock technicians data
const MOCK_TECHNICIANS: Technician[] = [
  { id: "TECH-001", name: "John Doe", specialization: "Installation & Maintenance", availability: true },
  { id: "TECH-002", name: "Jane Smith", specialization: "Repairs & Troubleshooting", availability: true },
  { id: "TECH-003", name: "David Mwangi", specialization: "Installation", availability: false },
  { id: "TECH-004", name: "Sarah Ochieng", specialization: "Maintenance & Inspection", availability: true },
  { id: "TECH-005", name: "Michael Kamau", specialization: "Repairs", availability: true },
]

// Mock inventory items
const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "INV-1001",
    name: "Solar Panel 250W",
    category: "Solar Panels",
    unitCost: 15000,
    buyingPrice: 12000,
    quantity: 25,
  },
  { id: "INV-1002", name: "Inverter 3kW", category: "Inverters", unitCost: 45000, buyingPrice: 38000, quantity: 12 },
  {
    id: "INV-1003",
    name: "Battery 12V 200Ah",
    category: "Batteries",
    unitCost: 32000,
    buyingPrice: 26000,
    quantity: 18,
  },
  {
    id: "INV-1004",
    name: "Mounting Bracket",
    category: "Mounting Systems",
    unitCost: 4500,
    buyingPrice: 3200,
    quantity: 40,
  },
  {
    id: "INV-1005",
    name: "Solar Cable 10m",
    category: "Cables & Wiring",
    unitCost: 2500,
    buyingPrice: 1800,
    quantity: 60,
  },
  {
    id: "INV-1006",
    name: "MC4 Connector Pair",
    category: "Connectors",
    unitCost: 800,
    buyingPrice: 500,
    quantity: 100,
  },
  {
    id: "INV-1007",
    name: "Charge Controller 30A",
    category: "Controllers",
    unitCost: 12000,
    buyingPrice: 9500,
    quantity: 15,
  },
  { id: "INV-1008", name: "Junction Box", category: "Accessories", unitCost: 3500, buyingPrice: 2500, quantity: 30 },
  { id: "INV-1009", name: "Fuse 15A", category: "Accessories", unitCost: 500, buyingPrice: 300, quantity: 50 },
  { id: "INV-1010", name: "Grounding Kit", category: "Installation", unitCost: 6000, buyingPrice: 4500, quantity: 20 },
]

export default function CreateServiceOrderPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inventorySearch, setInventorySearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    siteId: "",
    type: "",
    priority: "Medium",
    description: "",
    scheduledDate: new Date(),
    technicianId: "",
    estimatedHours: 4,
    laborRate: 3500,
    travelCost: 7500,
    otherCosts: 2000,
    notes: "",
    selectedParts: [] as { id: string; quantity: number }[],
  })

  // Get unique categories for filter
  const categories = Array.from(new Set(MOCK_INVENTORY.map((item) => item.category)))

  // Filter inventory items based on search query and category filter
  const filteredInventory = MOCK_INVENTORY.filter((item) => {
    // Search filter
    const matchesSearch =
      inventorySearch === "" ||
      item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      item.id.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      item.category.toLowerCase().includes(inventorySearch.toLowerCase())

    // Category filter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Selected parts with details
  const selectedPartsWithDetails = formData.selectedParts.map((selectedPart) => {
    const inventoryItem = MOCK_INVENTORY.find((item) => item.id === selectedPart.id)
    return {
      ...selectedPart,
      name: inventoryItem?.name || "Unknown Item",
      category: inventoryItem?.category || "Unknown Category",
      unitCost: inventoryItem?.unitCost || 0,
      buyingPrice: inventoryItem?.buyingPrice || 0,
    }
  })

  // Calculate estimated costs
  const calculateEstimatedCosts = () => {
    // Calculate revenue based on selling price (unitCost)
    const partsRevenue = selectedPartsWithDetails.reduce((sum, part) => sum + part.quantity * part.unitCost, 0)

    // Calculate actual cost based on buying price
    const partsCost = selectedPartsWithDetails.reduce((sum, part) => sum + part.quantity * part.buyingPrice, 0)

    const laborCost = formData.estimatedHours * formData.laborRate
    const totalCost = partsCost + laborCost + formData.travelCost + formData.otherCosts

    // Estimate invoice amount based on selling prices plus labor and other costs
    const estimatedInvoice = partsRevenue + laborCost + formData.travelCost + formData.otherCosts

    return {
      partsRevenue,
      partsCost,
      laborCost,
      totalCost,
      estimatedInvoice,
      estimatedProfit: estimatedInvoice - totalCost,
      estimatedMargin: estimatedInvoice > 0 ? (estimatedInvoice - totalCost) / estimatedInvoice : 0,
    }
  }

  const costs = calculateEstimatedCosts()

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, scheduledDate: date }))
    }
  }

  // Handle number input changes
  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  // Handle adding a part
  const handleAddPart = (partId: string) => {
    const inventoryItem = MOCK_INVENTORY.find((item) => item.id === partId)
    if (!inventoryItem) return

    // Check if part already exists in the list
    const existingPartIndex = formData.selectedParts.findIndex((part) => part.id === partId)

    if (existingPartIndex >= 0) {
      // Update quantity if part already exists
      const updatedParts = [...formData.selectedParts]
      updatedParts[existingPartIndex].quantity += 1

      setFormData((prev) => ({
        ...prev,
        selectedParts: updatedParts,
      }))
    } else {
      // Add new part
      setFormData((prev) => ({
        ...prev,
        selectedParts: [...prev.selectedParts, { id: partId, quantity: 1 }],
      }))
    }
  }

  // Handle removing a part
  const handleRemovePart = (partId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedParts: prev.selectedParts.filter((part) => part.id !== partId),
    }))
  }

  // Handle part quantity change
  const handlePartQuantityChange = (partId: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedParts: prev.selectedParts.map((part) => (part.id === partId ? { ...part, quantity } : part)),
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.siteId || !formData.type || !formData.technicianId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Service Order Created",
        description: "The service order has been created successfully.",
      })
      setIsSubmitting(false)
      router.push("/service-orders")
    }, 1500)
  }

  // Get selected site details
  const selectedSite = MOCK_SITES.find((site) => site.id === formData.siteId)

  // Get selected technician details
  const selectedTechnician = MOCK_TECHNICIANS.find((tech) => tech.id === formData.technicianId)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Create Service Order</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/service-orders")}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Order
                </>
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="materials">Materials & Costs</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic details for this service order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        Issued By <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter service title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">
                        Site Type <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select Site type" />
                        </SelectTrigger>
                        {/* <SelectContent>
                          <SelectItem value="Installation">Installation</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                          <SelectItem value="Repair">Repair</SelectItem>
                          <SelectItem value="Inspection">Inspection</SelectItem>
                        </SelectContent> */}
                      </Select>
                    </div>
                  </div>
{/* 
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter service description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div> */}

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => handleSelectChange("priority", value)}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}

                    <div className="space-y-2">
                      <Label>
                        Scheduled Date <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.scheduledDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.scheduledDate ? format(formData.scheduledDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.scheduledDate}
                            onSelect={handleDateChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Site Details</CardTitle>
                  <CardDescription>Select the site</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteId">
                      Site <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.siteId} onValueChange={(value) => handleSelectChange("siteId", value)}>
                      <SelectTrigger id="siteId">
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_SITES.map((site) => (
                          <SelectItem key={site.id} value={site.id}>
                            {site.name} ({site.county})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSite && (
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <div className="text-sm font-medium">Site Details</div>
                      <div className="text-sm">{selectedSite.address}</div>
                      <div className="text-sm text-muted-foreground">{selectedSite.county}</div>
                    </div>
                  )}

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="technicianId">
                      Issued by <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.technicianId}
                      onValueChange={(value) => handleSelectChange("technicianId", value)}
                    >
                      <SelectTrigger id="technicianId">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_TECHNICIANS.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id} disabled={!tech.availability}>
                            {tech.name} - {tech.specialization} {!tech.availability && "(Unavailable)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTechnician && (
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <div className="text-sm font-medium">Contact Person Details</div>
                      <div className="text-sm">Specialization: {selectedTechnician.specialization}</div>
                      <div className={`text-sm ${selectedTechnician.availability ? "text-green-600" : "text-red-600"}`}>
                        {selectedTechnician.availability ? "Available" : "Not Available"}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Parts & Materials</CardTitle>
                  <CardDescription>Select parts and materials needed for this service</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search inventory items..."
                          value={inventorySearch}
                          onChange={(e) => setInventorySearch(e.target.value)}
                          className="flex-1"
                        />
                      </div>

                      <div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Filter by category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Inventory Items Panel */}
                      <div className="border rounded-md">
                        <div className="p-3 border-b bg-muted">
                          <h3 className="font-medium">Available Inventory Items</h3>
                          <p className="text-sm text-muted-foreground">Click on an item to add it to your order</p>
                        </div>
                        <ScrollArea className="h-[400px]">
                          <div className="p-2 space-y-2">
                            {filteredInventory.length > 0 ? (
                              filteredInventory.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between items-center p-3 border rounded-md hover:bg-muted cursor-pointer"
                                  onClick={() => handleAddPart(item.id)}
                                >
                                  <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-muted-foreground">{item.category}</div>
                                  </div>
                                  <div className="text-right">
                                    <div>{item.unitCost.toLocaleString()} KSH</div>
                                    <div className="text-sm text-muted-foreground">Stock: {item.quantity}</div>
                                    <Button size="sm" variant="ghost" className="h-7 mt-1">
                                      <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                                <AlertCircle className="h-8 w-8 mb-2" />
                                <p>No items found matching your search criteria.</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Selected Items Panel */}
                      <div className="border rounded-md">
                        <div className="p-3 border-b bg-muted">
                          <h3 className="font-medium">Selected Items</h3>
                          <p className="text-sm text-muted-foreground">Items added to this service order</p>
                        </div>
                        <div className="p-2">
                          {selectedPartsWithDetails.length > 0 ? (
                            <div className="space-y-3">
                              {selectedPartsWithDetails.map((part) => (
                                <div key={part.id} className="flex justify-between items-center p-3 border rounded-md">
                                  <div>
                                    <div className="font-medium">{part.name}</div>
                                    <div className="text-sm text-muted-foreground">{part.category}</div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center">
                                      <Label htmlFor={`quantity-${part.id}`} className="sr-only">
                                        Quantity
                                      </Label>
                                      <Input
                                        id={`quantity-${part.id}`}
                                        type="number"
                                        min="1"
                                        value={part.quantity}
                                        onChange={(e) =>
                                          handlePartQuantityChange(part.id, Number.parseInt(e.target.value) || 1)
                                        }
                                        className="w-16 h-8"
                                      />
                                    </div>
                                    <div className="text-right min-w-[100px]">
                                      <div>{(part.unitCost * part.quantity).toLocaleString()} KSH</div>
                                      <div className="text-sm text-muted-foreground">
                                        {part.quantity} × {part.unitCost.toLocaleString()} KSH
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => handleRemovePart(part.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}

                              <div className="mt-4 p-3 border rounded-md bg-muted">
                                <div className="flex justify-between font-medium">
                                  <span>Total Items:</span>
                                  <span>
                                    {selectedPartsWithDetails.length} items (
                                    {selectedPartsWithDetails.reduce((sum, part) => sum + part.quantity, 0)} units)
                                  </span>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span>Total Revenue:</span>
                                  <span>{costs.partsRevenue.toLocaleString()} KSH</span>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span>Total Cost:</span>
                                  <span>{costs.partsCost.toLocaleString()} KSH</span>
                                </div>
                                <div className="flex justify-between mt-1 text-green-600 font-medium">
                                  <span>Profit:</span>
                                  <span>{(costs.partsRevenue - costs.partsCost).toLocaleString()} KSH</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                              <p>No items added yet. Select items from the inventory list.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader>
                  <CardTitle>Labor & Additional Costs</CardTitle>
                  <CardDescription>Estimate labor and other costs for this service</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="estimatedHours">Estimated Labor Hours</Label>
                        <Input
                          id="estimatedHours"
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={formData.estimatedHours}
                          onChange={(e) => handleNumberChange("estimatedHours", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="laborRate">Labor Rate (KSH/hour)</Label>
                        <Input
                          id="laborRate"
                          type="number"
                          min="0"
                          step="100"
                          value={formData.laborRate}
                          onChange={(e) => handleNumberChange("laborRate", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="travelCost">Travel Cost (KSH)</Label>
                        <Input
                          id="travelCost"
                          type="number"
                          min="0"
                          step="100"
                          value={formData.travelCost}
                          onChange={(e) => handleNumberChange("travelCost", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="otherCosts">Other Costs (KSH)</Label>
                        <Input
                          id="otherCosts"
                          type="number"
                          min="0"
                          step="100"
                          value={formData.otherCosts}
                          onChange={(e) => handleNumberChange("otherCosts", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-md">
                      <h3 className="font-medium mb-3">Cost Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Parts Revenue:</span>
                          <span>{costs.partsRevenue.toLocaleString()} KSH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Parts Cost (Buying Price):</span>
                          <span>{costs.partsCost.toLocaleString()} KSH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>
                            Labor Cost ({formData.estimatedHours} hours @ {formData.laborRate.toLocaleString()}{" "}
                            KSH/hour):
                          </span>
                          <span>{costs.laborCost.toLocaleString()} KSH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Travel Cost:</span>
                          <span>{formData.travelCost.toLocaleString()} KSH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Other Costs:</span>
                          <span>{formData.otherCosts.toLocaleString()} KSH</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-medium">
                          <span>Total Cost (Buying Price + Labor + Travel + Other):</span>
                          <span>{costs.totalCost.toLocaleString()} KSH</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total Revenue (Selling Price + Labor + Travel + Other):</span>
                          <span>{costs.estimatedInvoice.toLocaleString()} KSH</span>
                        </div>
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>Estimated Profit:</span>
                          <span>
                            {costs.estimatedProfit.toLocaleString()} KSH ({(costs.estimatedMargin * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </TabsContent>

            {/* <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                  <CardDescription>Add any additional information or instructions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Enter any additional notes or instructions for this service order..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="min-h-[200px]"
                  />
                </CardContent>
              </Card>
            </TabsContent> */}
          </Tabs>

          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const prevTab = activeTab === "notes" ? "materials" : activeTab === "materials" ? "details" : "details"
                setActiveTab(prevTab)
              }}
              disabled={activeTab === "details"}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const nextTab = activeTab === "details" ? "materials" : activeTab === "materials" ? "notes" : "notes"
                  setActiveTab(nextTab)
                }}
                disabled={activeTab === "notes"}
              >
                Next
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}


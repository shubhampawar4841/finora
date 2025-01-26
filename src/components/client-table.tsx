"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, Mail, Phone, Info, Upload, UserPlus, PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import CSVUpload from "@/components/add-csv"
import ClientForm from "./add-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ClientTableSkeleton } from "./skeleton/client-table-skeleton"
import { dummyClients, relationshipManagers, riskProfiles, plans } from "../lib/dummydata"
import { Client, SortDirection, SortField } from "../lib/types"
import { levenshtein } from '@/lib/utils'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// New Client Form Component
const AddClientForm = ({ onClose }: { onClose: () => void }) => {
  // ... existing form code ...
}

export default function ClientTable() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null)
  const [excludeInactive, setExcludeInactive] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRMs, setSelectedRMs] = useState<string[]>([])
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<string>("All Risk Profiles")
  const [selectedPlan, setSelectedPlan] = useState<string>("All Plans")
  const [showAddClientDialog, setShowAddClientDialog] = useState(false)
  const [showCSVDialog, setShowCSVDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingClient, setExistingClient] = useState<Client | null>(null)

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setClients(dummyClients)
      setLoading(false)
    }, 1500)
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  const MAX_DISTANCE = 3;
  const filteredClients = clients
    .filter(client => {
      if (excludeInactive && client.status === 'inactive') return false
      if (searchTerm && !client.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
      //if (searchTerm && levenshtein(client.name.toLowerCase(), searchTerm.toLowerCase()) > MAX_DISTANCE) return false
      if (selectedRiskProfile !== "All Risk Profiles" && client.risk_profile !== selectedRiskProfile) return false
      if (selectedPlan !== "All Plans" && client.plan_name !== selectedPlan) return false
      if (selectedRMs.length > 0 && !selectedRMs.includes(client.rm_name)) return false
      return true
    })
    .sort((a, b) => {
      if (!sortField || !sortDirection) return 0
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  const handleSubmit = async (formData: Partial<Client>) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (existingClient) {
        // Update existing client
        setClients(prevClients => 
          prevClients.map(client => 
            client.client_id === existingClient.client_id 
              ? { ...client, ...formData }
              : client
          )
        )
      } else {
        // Add new client
        const newClient: Client = {
          client_id: Math.random().toString(36).substr(2, 9), // Generate random ID
          status: 'active',
          kyc_status: 'pending',
          days_to_renewal: 30,
          ...formData
        }
        setClients(prevClients => [...prevClients, newClient])
      }
      
      setShowAddClientDialog(false)
      setExistingClient(null)
    } catch (error) {
      console.error('Error submitting client:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClient = (client: Client) => {
    setExistingClient(client)
    setShowAddClientDialog(true)
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{selectedPlan}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedPlan("All Plans")}>
              All Plans
            </DropdownMenuItem>
            {plans.map(plan => (
              <DropdownMenuItem key={plan} onClick={() => setSelectedPlan(plan)}>
                {plan}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{selectedRiskProfile}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedRiskProfile("All Risk Profiles")}>
              All Risk Profiles
            </DropdownMenuItem>
            {riskProfiles.map(profile => (
              <DropdownMenuItem key={profile} onClick={() => setSelectedRiskProfile(profile)}>
                {profile}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-primary">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setShowAddClientDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>Insert Client</span>
                <span className="text-xs text-muted-foreground">Insert client details</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowCSVDialog(true)}>
              <Upload className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>Import Data from CSV</span>
                <span className="text-xs text-muted-foreground">Insert new clients from CSV</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="text-primary">
          Reset Filters
        </Button>

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="excludeInactive"
              checked={excludeInactive}
              onCheckedChange={(checked) => setExcludeInactive(checked as boolean)}
            />
            <label htmlFor="excludeInactive">Exclude inactive clients</label>
          </div>

          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-[300px]"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <ScrollArea className=" h-[80vh] rounded-md border">
          <Table>
            <TableHeader className="">
              <TableRow>
                <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                  Client {sortField === 'name' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                </TableHead>
                <TableHead onClick={() => handleSort('days_to_renewal')} className="cursor-pointer">
                  Time to renewal (days) {sortField === 'days_to_renewal' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                </TableHead>
                <TableHead onClick={() => handleSort('rm_name')} className="cursor-pointer">
                  Assigned RM {sortField === 'rm_name' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                </TableHead>
                <TableHead onClick={() => handleSort('risk_profile')} className="cursor-pointer">
                  Risk profile {sortField === 'risk_profile' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                </TableHead>
                <TableHead>Outreach</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <ClientTableSkeleton />
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.client_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {client.name}
                        </div>
                        <div>
                          <div className="font-medium truncate max-w-[200px]">{client.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {client.kyc_status === 'verified' ? 'KYC Verified' : 'KYC Pending'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.status === 'inactive' ? (
                        <span className="text-muted-foreground">Inactive</span>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">
                            {client.plan_name}
                          </div>
                          <div className="h-2 rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${Math.min(100, (client.days_to_renewal / 30) * 100)}%` }}
                            />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Renewal in {client.days_to_renewal} days
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.rm_name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {client.rm_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{client.risk_profile}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)}>
                          <Info className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Add Client Form Dialog */}
      <Dialog open={showAddClientDialog} onOpenChange={setShowAddClientDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter the client's details below
              <ClientForm
                onSubmit={handleSubmit}
                initialData={existingClient}
                isLoading={isSubmitting}
                onCancel={() => setShowAddClientDialog(false)}
                mode="edit"
              />
            </DialogDescription>
          </DialogHeader>
          <AddClientForm onClose={() => setShowAddClientDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* CSV Import Dialog */}
      <Dialog open={showCSVDialog} onOpenChange={setShowCSVDialog}>
        <DialogContent side="right" className="sm:max-w-[33vw] absolute right-0 h-full">
          <DialogHeader>
            <DialogTitle>Import Clients from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file containing client data
            </DialogDescription>
          </DialogHeader>
          <CSVUpload />
        </DialogContent>
      </Dialog>
    </div>
  )
}



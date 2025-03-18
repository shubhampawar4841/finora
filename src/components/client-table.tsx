import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area"; // Correct import
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { ClientFilters, ClientTableHeader, ClientTableRow } from "./components";
import { ClientFilters } from "./ClientFilters";
import { ClientTableHeader } from "./ClientTableHeader";
import { ClientTableRow } from "./ClientTableRow";
import { ClientTableSkeleton } from "./skeleton/client-table-skeleton";
import  ClientSidePanel from "./clientsidepanel";
import { supabase } from "@/utils/supabaseClient";
import ClientForm from "./add-client";
import CSVUpload from "@/components/add-csv";
import { Client } from "../lib/types";

export default function ClientTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [excludeInactive, setExcludeInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRiskProfile, setSelectedRiskProfile] = useState("All Risk Profiles");
  const [selectedPlan, setSelectedPlan] = useState("All Plans");
  const [showAddClientDialog, setShowAddClientDialog] = useState(false);
  const [showCSVDialog, setShowCSVDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingClient, setExistingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Define plans and riskProfiles
  const plans = ["Plan A", "Plan B", "Plan C"]; // Example plans
  const riskProfiles = ["Low Risk", "Medium Risk", "High Risk"]; // Example risk profiles

  // Fetch clients from Supabase
  const fetchClients = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('client3')
        .select('*');

      if (error) throw error;

      setClients(data || []);
    } catch (err) {
      setError(`Error fetching clients: ${err.message}`);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDeleteClient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      const { error } = await supabase
        .from('client3')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh client list
      await fetchClients();
    } catch (err) {
      setError(`Error deleting client: ${err.message}`);
      console.error('Error deleting client:', err);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');

    try {
      if (existingClient) {
        // Update existing client
        const { data, error } = await supabase
          .from('client3')
          .update(formData)
          .eq('id', existingClient.id);

        if (error) throw error;

        // Refresh client list
        await fetchClients();
      } else {
        // Add new client
        const { data, error } = await supabase
          .from('client3')
          .insert([formData]);

        if (error) throw error;

        // Refresh client list
        await fetchClients();
      }

      setShowAddClientDialog(false);
      setExistingClient(null);
    } catch (err) {
      setError(`Error submitting client: ${err.message}` );
      console.error('Error submitting client:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEditClient = (client) => {
    setExistingClient(client);
    setShowAddClientDialog(true);
  };


  const filteredClients = clients
    .filter(client => {
      if (excludeInactive && client.status === 'inactive') return false;
      if (searchTerm && !client.name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (selectedRiskProfile !== "All Risk Profiles" && client.risk !== selectedRiskProfile) return false;
      if (selectedPlan !== "All Plans" && client.plan !== selectedPlan) return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortField || !sortDirection) return 0;

      // Handle nulls
      if (a[sortField] === null) return sortDirection === 'asc' ? -1 : 1;
      if (b[sortField] === null) return sortDirection === 'asc' ? 1 : -1;

      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRiskProfile('All Risk Profiles');
    setSelectedPlan('All Plans');
    setExcludeInactive(false);
  };

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ClientFilters
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        selectedRiskProfile={selectedRiskProfile}
        setSelectedRiskProfile={setSelectedRiskProfile}
        excludeInactive={excludeInactive}
        setExcludeInactive={setExcludeInactive}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resetFilters={resetFilters}
        plans={plans}
        riskProfiles={riskProfiles}
        setShowAddClientDialog={setShowAddClientDialog}
        setShowCSVDialog={setShowCSVDialog}
        setExistingClient={setExistingClient}
      />

      <div className="rounded-md border">
        {/* Use ScrollArea here */}
        <ScrollArea className="h-[80vh] rounded-md border">
          <Table>
            <ClientTableHeader handleSort={handleSort} sortField={sortField} />
            <TableBody>
              {loading ? (
                <ClientTableSkeleton />
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No clients found. Try adjusting your filters or add a new client.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <ClientTableRow
                    key={client.id}
                    client={client}
                    handleEditClient={handleEditClient}
                    handleDeleteClient={handleDeleteClient}
                    setSelectedClient={setSelectedClient}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {selectedClient && (
        <ClientSidePanel
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}

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
  );
}
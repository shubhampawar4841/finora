import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { createClerkSupabaseClient } from "@/utils/supabaseClient";
import { X } from "lucide-react";
import { useSession } from "@clerk/nextjs";

type Client = {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  assigned_rn: string;
  risk: "aggressive" | "hard" | "conservative";
  ekyc_status?: "pending" | "verified" | "rejected";
  plan?: "elite" | "premium" | "standard";
};

type TradeData = {
  stock: string;
  tradeType: "BUY" | "SELL";
  segment: "EQUITY" | "F&O" | "COMMODITIES";
  timeHorizon: "INTRADAY" | "SWING" | "LONGTERM";
  entry: string;
  stoploss: string;
  targets: string[];
  trailingSL: boolean;
  rangeEntry: boolean;
  rangeTarget: boolean;
  status: "ACTIVE" | "COMPLETED";
  createdAt: string;
};

export default function PostAdviceForm({ 
  selectedStock,
  onSuccess
}: { 
  selectedStock?: string;
  onSuccess?: () => void;
}) {
  const { session } = useSession();
  const searchRef = useRef<HTMLDivElement>(null);

  // Form state
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [segment, setSegment] = useState<"EQUITY" | "F&O" | "COMMODITIES">("EQUITY");
  const [timeHorizon, setTimeHorizon] = useState<"INTRADAY" | "SWING" | "LONGTERM">("INTRADAY");
  const [entryPrice, setEntryPrice] = useState("");
  const [stoplossPrice, setStoplossPrice] = useState("");
  const [targetPrices, setTargetPrices] = useState("");
  const [trailingSL, setTrailingSL] = useState(false);
  const [rangeEntry, setRangeEntry] = useState(false);
  const [rangeTarget, setRangeTarget] = useState(false);

  // Client search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch clients on search query change
  useEffect(() => { 
    const fetchSearchResults = async () => {
      if (searchQuery.length > 2) {
        const supabase = await createClerkSupabaseClient(session);
        const { data, error } = await supabase
          .from("client3")
          .select("id, name, risk, plan")
          .or(`risk.ilike.%${searchQuery}%,plan.ilike.%${searchQuery}%`)
          .limit(40);
        
        if (!error) {
          setSearchResults(data || []);
          setShowSearchResults(true);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    };
    
    const debounceTimer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, session]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setSearchQuery(`${client.name} (${client.assigned_rn})`);
    setShowSearchResults(false);
  };

  const handleSubmit = async () => {
    if (!selectedClient || !entryPrice || !stoplossPrice || !targetPrices) {
      alert("Please fill all required fields and select a client");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const supabase = await createClerkSupabaseClient(session);
      
      const newTrade: TradeData = {
        stock: selectedStock || "UNKNOWN",
        tradeType,
        segment,
        timeHorizon,
        entry: entryPrice,
        stoploss: stoplossPrice,
        targets: targetPrices.split(",").map(t => t.trim()),
        trailingSL,
        rangeEntry,
        rangeTarget,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      };

      // Insert into user_trades table
      const { error } = await supabase
        .from("user_trades")
        .insert({
          user_id: selectedClient.id,
          trade_data: newTrade
        });

      if (error) throw error;

      // Reset form
      setEntryPrice("");
      setStoplossPrice("");
      setTargetPrices("");
      setSelectedClient(null);
      setSearchQuery("");
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error submitting trade:", error);
      alert("Failed to post trade advice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-lg w-full border rounded-xl shadow-lg p-4" ref={searchRef}>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Post advice for {selectedStock}</h2>
        </div>

        {selectedClient && (
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={selectedClient.ekyc_status === "verified" ? "success" : "warning"}>
              {(selectedClient.ekyc_status || '').toUpperCase()}
            </Badge>
            <span className="text-gray-700 font-medium">{selectedClient.name}</span>
            <Badge variant="outline">{(selectedClient.plan || '').toUpperCase()}</Badge>
          </div>
        )}

        <div className="mb-4">
          <Label>Time horizon</Label>
          <RadioGroup 
            value={timeHorizon} 
            onValueChange={(value: "INTRADAY" | "SWING" | "LONGTERM") => setTimeHorizon(value)}
            className="flex gap-4 mt-1"
          >
            <Label className="flex items-center gap-2">
              <RadioGroupItem value="INTRADAY" /> INTRADAY
            </Label> 
            <Label className="flex items-center gap-2">
              <RadioGroupItem value="SWING" /> SWING
            </Label>
            <Label className="flex items-center gap-2">
              <RadioGroupItem value="LONGTERM" /> LONGTERM
            </Label>
          </RadioGroup>
        </div>

        <div className="mb-4">
          <Label>Entry</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input 
              type="text" 
              placeholder="₹" 
              className="flex-1" 
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Switch checked={rangeEntry} onCheckedChange={setRangeEntry} />
              <Label>Range</Label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Label>Stoploss</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input 
              type="text" 
              placeholder="₹" 
              className="flex-1" 
              value={stoplossPrice}
              onChange={(e) => setStoplossPrice(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Switch checked={trailingSL} onCheckedChange={setTrailingSL} />
              <Label>Trailing</Label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Label>Target(s)</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input 
              type="text" 
              placeholder="₹ (comma separated for multiple)" 
              className="flex-1" 
              value={targetPrices}
              onChange={(e) => setTargetPrices(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Switch checked={rangeTarget} onCheckedChange={setRangeTarget} />
              <Label>Range</Label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Label>Search Client</Label>
          <Input 
            type="text" 
            placeholder="Search by name, email or RN..." 
            className="mt-1" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchResults(true)}
          />
          {showSearchResults && searchResults.length > 0 && (
            <ul className="mt-2 border rounded p-2 max-h-60 overflow-y-auto">
              {searchResults.map((client) => (
                <li 
                  key={client.id} 
                  className="p-2 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleClientSelect(client)}
                >
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-gray-600">{client.email}</div>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{client.assigned_rn}</Badge>
                    <Badge variant={client.risk === "aggressive" ? "destructive" : "outline"}>
                      {client.risk}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button 
          className="w-full" 
          disabled={!selectedClient || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Posting..." : "Post Advice"}
        </Button>
      </CardContent>
    </Card>
  );
}
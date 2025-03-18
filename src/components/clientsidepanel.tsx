import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, X } from "lucide-react";

interface Client {
  name: string;
  entry: string;
  stoploss: string;
  targets: string[];
}

interface ClientSidePanelProps {
  client: Client;
  onClose: () => void;
}

const ClientSidePanel: React.FC<ClientSidePanelProps> = ({ client, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);

  return (
    <div className="fixed right-0 top-0 h-full w-108 bg-white shadow-lg p-6 border-l">
      {/* Header with Client Info & Close Button */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">{client.name}</h2>
          <div className="flex space-x-2 mt-1">
            <Badge className="bg-purple-100 text-purple-700">Elite</Badge>
            <Badge className="bg-green-100 text-green-700">Aggressive</Badge>
          </div>
        </div>
        <Button variant="ghost" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="trades">
        <TabsList className="flex justify-between border-b pb-2 mb-4">
          <TabsTrigger value="return">Return</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="calls">Call Logs</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="billings">Billings</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Dropdown Sections in Flex Layout */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equity">Equity</SelectItem>
                <SelectItem value="futures">Futures</SelectItem>
                <SelectItem value="options">Options</SelectItem>
                <SelectItem value="commodities">Commodities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Call Orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market Order</SelectItem>
                <SelectItem value="limit">Limit Order</SelectItem>
                <SelectItem value="stop">Stop Order</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Horizon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intraday">Intraday</SelectItem>
                <SelectItem value="swing">Swing Trading</SelectItem>
                <SelectItem value="positional">Positional Trading</SelectItem>
                <SelectItem value="long-term">Long-Term Investment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Post Trade
        </button>
      </div>


      {/* Trade Card - Clickable for Expansion */}
      <div
        className="p-4 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Top Section */}
        <div className="flex justify-between items-center">
          {/* Left Section (Type & Name) */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-green-600 font-semibold">BUY</span>
            <span className="text-gray-500">TATACHEM EQUITY</span>
            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-md">F&O</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">Intraday</span>
          </div>

          {/* Right Section (Date & Time) */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>📅 24 Oct 2024</span>
            <span>⏰ 10:28:20 AM</span>
          </div>
        </div>

        {/* Expanded Section */}
        {isExpanded && (
          <div className="mt-4 p-4 border-t bg-white rounded-md shadow-sm flex gap-4">

            {/* First Div - 3/4 of width */}
            <div className="w-3/4">
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-md">Buy</span>
                  <span className="font-bold text-lg">TATACHEM</span>
                  <span className="text-xs px-2 py-1 border rounded-md">EQUITY</span>
                  <span className="text-green-600 text-sm font-medium flex items-center gap-1">📈 10%</span>
                </div>
                <button className="text-orange-500 text-sm border px-2 py-1 rounded-md hover:bg-orange-50 hover:text-orange-700 transition">
                  ⚠️ Generate rationale
                </button>
              </div>

              {/* Entry, Stoploss, and Targets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 text-sm text-gray-700">
                <div>
                  <p className="flex items-center gap-1 font-medium">⏳ Entry</p>
                  <span className="text-gray-900 font-semibold">{client.entry}</span>
                </div>
                <div>
                  <p className="flex items-center gap-1 font-medium">🚫 Stoploss</p>
                  <span className="text-gray-900 font-semibold">{client.stoploss}</span>
                </div>
                <div>
                  <p className="flex items-center gap-1 font-medium">🚩 Target(s)</p>
                  <span className="text-gray-900 font-semibold">{client.targets?.join(" » ") ?? "No targets"}</span>
                </div>
              </div>
            </div>

            {/* Second Div - 1/4 of width */}
            <div className="w-1/4 text- text-zinc-800">
              <p className="mb-2"><strong>📩 24 Oct 2024</strong> {client.startDate} <span className="text-gray-400">{client.startTime}</span></p>
              <p><strong>⏳ 10:28:20 AM</strong> {client.endDate} <span className="text-gray-400">{client.endTime}</span></p>
            </div>

          </div>
        )}
      </div>



      <div
        className="p-4 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
        onClick={() => setIsExpanded2(!isExpanded2)}
      >
        {/* Top Section */}
        <div className="flex justify-between items-center">
          {/* Left Section (Type & Name) */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-green-600 font-semibold">BUY</span>
            <span className="text-gray-500">TATACHEM EQUITY</span>
            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-md">F&O</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">Intraday</span>
          </div>

          {/* Right Section (Date & Time) */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>📅 24 Oct 2024</span>
            <span>⏰ 10:28:20 AM</span>
          </div>
        </div>

        {/* Expanded Section */}
        {isExpanded2 && (
          <div className="mt-4 p-4 border-t bg-white rounded-md shadow-sm flex gap-4">

            {/* First Div - 3/4 of width */}
            <div className="w-3/4">
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-md">Buy</span>
                  <span className="font-bold text-lg">TATACHEM</span>
                  <span className="text-xs px-2 py-1 border rounded-md">EQUITY</span>
                  <span className="text-green-600 text-sm font-medium flex items-center gap-1">📈 10%</span>
                </div>
                <button className="text-orange-500 text-sm border px-2 py-1 rounded-md hover:bg-orange-50 hover:text-orange-700 transition">
                  ⚠️ Generate rationale
                </button>
              </div>

              {/* Entry, Stoploss, and Targets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 text-sm text-gray-700">
                <div>
                  <p className="flex items-center gap-1 font-medium">⏳ Entry</p>
                  <span className="text-gray-900 font-semibold">{client.entry}</span>
                </div>
                <div>
                  <p className="flex items-center gap-1 font-medium">🚫 Stoploss</p>
                  <span className="text-gray-900 font-semibold">{client.stoploss}</span>
                </div>
                <div>
                  <p className="flex items-center gap-1 font-medium">🚩 Target(s)</p>
                  <span className="text-gray-900 font-semibold">{client.targets?.join(" » ") ?? "No targets"}</span>
                </div>
              </div>
            </div>

            {/* Second Div - 1/4 of width */}
            <div className="w-1/4 text- text-zinc-800">
              <p className="mb-2"><strong>📩 24 Oct 2024</strong> {client.startDate} <span className="text-gray-400">{client.startTime}</span></p>
              <p><strong>⏳ 10:28:20 AM</strong> {client.endDate} <span className="text-gray-400">{client.endTime}</span></p>
            </div>

          </div>
        )}
      </div>



      {/* Action Buttons */}
      <div className="flex justify-between mt-4">
        <Button variant="outline" className="mr-2">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="outline">
          <Mail className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ClientSidePanel;

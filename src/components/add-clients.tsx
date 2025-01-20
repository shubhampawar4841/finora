'use Client'

import { useState } from 'react'
import { useUser, useSession } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function CSVUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCSVData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const { toast } = useToast()
  const { user } = useUser()
  const { session } = useSession()

  // Create Supabase client with Clerk token
  const createClerkSupabaseClient = () => {
    return createClient(
      'https://aemmtphwxgednzbtlgcc.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlbW10cGh3eGdlZG56YnRsZ2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0NDI4ODQsImV4cCI6MjA0ODAxODg4NH0.5Goe_WKejX0nxIE-q_YZd2UVU-VkHMgu1FqgQ5w9ijU',
      {
        global: {
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({ template: 'supabase' })
            const headers = new Headers(options?.headers || {})
            headers.set('Authorization', `Bearer ${clerkToken}`)
            return fetch(url, { ...options, headers })
          },
        },
      }
    )
  }

  const supabase = createClerkSupabaseClient()

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setPreviewVisible(false)

    // Parse CSV file
    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const { data, errors } = result

        if (errors.length > 0) {
          toast({
            title: "Error",
            description: "CSV file contains errors. Please check the format.",
          })
          return
        }

        // Validate CSV structure
        const requiredHeaders = [
          'id',
          'user_id',
          'full_name',
          'email',
          'sebi_license_number',
          'whatsapp_number',
          'profile_description',
          'created_at',
          'updated_at',
        ]
        const headers = Object.keys(data[0])
        const isValid = requiredHeaders.every((header) => headers.includes(header))

        if (!isValid) {
          toast({
            title: "Error",
            description: "CSV file structure is invalid. Please check the headers.",
          })
          return
        }

        setCSVData(data)
        setPreviewVisible(true)
      },
    })
  }

  // Insert data into Supabase
  const handleInsertData = async () => {
    if (!user || !file || csvData.length === 0) return

    setLoading(true)

    try {
      const formattedData = csvData.map((row) => ({
        user_id: user.id,
        full_name: row.full_name,
        email: row.email,
        sebi_license_number: row.sebi_license_number,
        whatsapp_number: row.whatsapp_number,
        profile_description: row.profile_description,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }))

      const { error } = await supabase.from('your_table_name').insert(formattedData)

      if (error) {
        toast({
          title: "Error inserting data",
          description: error.message,
        })
      } else {
        toast({
          title: "Success",
          description: "Data inserted successfully!",
        })
        setFile(null)
        setCSVData([])
        setPreviewVisible(false)
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload CSV File</h1>

      <Input type="file" accept=".csv" onChange={handleFileUpload} disabled={loading} />

      {previewVisible && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Preview</h2>
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(csvData[0]).map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.slice(0, 5).map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, i) => (
                    <TableCell key={i}>{String(value)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex gap-2">
            <Button onClick={handleInsertData} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Insert Data'}
            </Button>
            <Button variant="outline" onClick={() => setPreviewVisible(false)} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
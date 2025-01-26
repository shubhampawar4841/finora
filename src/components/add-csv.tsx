'use Client'

import React, { useState, useCallback } from 'react'
import { useUser, useSession } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function CSVUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [pastedText, setPastedText] = useState('')
  const [csvData, setCSVData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [previewVisible, setPreviewVisible] = useState(false)
  const { toast } = useToast()
  const { user } = useUser()
  const { session } = useSession()

  // Create Supabase client with Clerk token
  const createClerkSupabaseClient = () => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url: string, options: RequestInit = {}) => {
            const clerkToken = await session?.getToken({ template: 'supabase' })
            const headers = new Headers(options.headers || {})
            headers.set('Authorization', `Bearer ${clerkToken}`)
            return fetch(url, { ...options, headers })
          },
        },
      }
    )
  }

  const supabase = createClerkSupabaseClient()

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'text/csv' || droppedFile?.name.endsWith('.tsv')) {
      setFile(droppedFile)
      setError('')
    } else {
      setError('Please upload a CSV or TSV file')
    }
  }, [])

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile?.type === 'text/csv' || selectedFile?.name.endsWith('.tsv')) {
      setFile(selectedFile)
      setError('')
    } else {
      setError('Please upload a CSV or TSV file')
    }
  }

  const handlePasteText = (e) => {
    setPastedText(e.target.value)
    setError('')
  }

  const handleRemoveFile = () => {
    setFile(null)
    setCSVData([])
    setError('')
  }

  const handleImport = async () => {
    // Simulated import process
    setLoading(true)
    try {
      // Add actual import logic here
      await new Promise(resolve => setTimeout(resolve, 1500))
      setLoading(false)
      toast({
        title: "Success",
        description: "Data imported successfully!",
      })
    } catch (err) {
      setError('Import failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add data to public.relationship_managers</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload">
            <TabsList fullWidth className="mb-4">
              <TabsTrigger value="upload">Upload CSV</TabsTrigger>
              <TabsTrigger value="paste">Paste text</TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {!file ? (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop, or <button className="text-blue-500 hover:text-blue-600" onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}>browse</button> your files
                    </p>
                    <input
                      type="file"
                      accept=".csv,.tsv"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <button
                      onClick={handleRemoveFile}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="paste">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Copy a table from a spreadsheet program and paste it below. The first row should be the headers.
                </p>
                <textarea
                  className="w-full h-64 p-2 border rounded-lg resize-none"
                  placeholder="Paste your data here..."
                  value={pastedText}
                  onChange={handlePasteText}
                />
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {previewVisible && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {Object.keys(csvData[0] || {}).map((header) => (
                        <th key={header} className="p-2 border text-left">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 5).map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((cell, j) => (
                          <td key={j} className="p-2 border">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="outline" onClick={handleRemoveFile}>Cancel</Button>
          <Button 
            disabled={(!file && !pastedText) || loading} 
            onClick={handleImport}
          >
            {loading ? 'Importing...' : 'Import data'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
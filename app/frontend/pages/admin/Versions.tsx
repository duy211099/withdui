import { Head, router } from '@inertiajs/react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface User {
  id: string
  name: string | null
  email: string
}

interface Version {
  id: number
  event: 'create' | 'update' | 'destroy'
  item_type: string
  item_id: string
  whodunnit: string | null
  object: string | null
  object_changes: string | null
  created_at: string
  user: User | null
}

interface PagyMetadata {
  page: number
  pages: number
  count: number
  limit: number
  next: number | null
  prev: number | null
  from: number
  to: number
}

interface VersionsProps {
  versions: Version[]
  pagy: PagyMetadata
}

export default function Versions({ versions, pagy }: VersionsProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handlePageChange = (page: number) => {
    router.visit(`/admin/versions?page=${page}`, {
      preserveScroll: true,
    })
  }

  const getEventBadge = (event: string) => {
    const variants = {
      create: 'default',
      update: 'secondary',
      destroy: 'destructive',
    } as const

    return (
      <Badge variant={variants[event as keyof typeof variants] || 'outline'}>
        {event.toUpperCase()}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const parseChanges = (objectChanges: string | null) => {
    if (!objectChanges) return null
    try {
      return JSON.parse(objectChanges)
    } catch {
      return null
    }
  }

  const formatValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">null</span>
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false'
    }
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return String(value)
  }

  const renderChanges = (version: Version) => {
    const changes = parseChanges(version.object_changes)

    if (!changes || Object.keys(changes).length === 0) {
      return (
        <div className="text-sm text-muted-foreground italic">No detailed changes available</div>
      )
    }

    // Filter out system fields that aren't interesting to users
    const systemFields = ['updated_at', 'created_at']
    const filteredChanges = Object.entries(changes).filter(
      ([field]) => !systemFields.includes(field)
    )

    if (filteredChanges.length === 0) {
      return (
        <div className="text-sm text-muted-foreground italic">Only system fields were updated</div>
      )
    }

    return (
      <div className="space-y-2">
        {filteredChanges.map(([field, value]) => {
          // PaperTrail stores changes as [old_value, new_value]
          const changeArray = Array.isArray(value) ? value : [null, value]
          const [oldValue, newValue] = changeArray

          return (
            <div key={field} className="grid grid-cols-[120px_1fr_1fr] gap-4 text-sm">
              <div className="font-medium text-muted-foreground">{field}:</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {formatValue(oldValue)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">→</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {formatValue(newValue)}
                </Badge>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <Head title="Audit Logs" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">Track all changes made across the system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity History ({pagy.count} total changes)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Changed By</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  versions.map((version) => {
                    const isExpanded = expandedRows.has(version.id)
                    // Check if there are meaningful changes (not just system fields)
                    const changes = parseChanges(version.object_changes)
                    const systemFields = ['updated_at', 'created_at']
                    const hasChanges =
                      changes && Object.keys(changes).some((field) => !systemFields.includes(field))

                    return (
                      <>
                        <TableRow key={version.id} className="group">
                          <TableCell>
                            {hasChanges && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRow(version.id)}
                                className="h-8 w-8 p-0"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>{getEventBadge(version.event)}</TableCell>
                          <TableCell className="font-medium">{version.item_type}</TableCell>
                          <TableCell className="font-mono text-xs">{version.item_id}</TableCell>
                          <TableCell>
                            {version.user ? (
                              <div>
                                <div className="font-medium">{version.user.name || 'Unknown'}</div>
                                <div className="text-xs text-muted-foreground">
                                  {version.user.email}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">System</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(version.created_at)}
                          </TableCell>
                        </TableRow>
                        {isExpanded && hasChanges && (
                          <TableRow key={`${version.id}-details`}>
                            <TableCell colSpan={6} className="bg-muted/50 p-6">
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm">Changes:</h4>
                                {renderChanges(version)}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {pagy.pages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {pagy.from} to {pagy.to} of {pagy.count} entries
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pagy.prev && handlePageChange(pagy.prev)}
                    disabled={!pagy.prev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagy.pages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={page === pagy.page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      )
                    })}
                    {pagy.pages > 5 && (
                      <>
                        <span className="px-2">...</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagy.pages)}
                        >
                          {pagy.pages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pagy.next && handlePageChange(pagy.next)}
                    disabled={!pagy.next}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

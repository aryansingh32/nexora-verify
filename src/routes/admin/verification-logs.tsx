import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVerificationLogs } from "@/lib/admin.functions";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/admin/Pagination";
import { Search } from "lucide-react";

export const Route = createFileRoute("/admin/verification-logs")({
  component: VerificationLogsPage,
});

function VerificationLogsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const { data, isLoading } = useQuery({
    queryKey: ["verification-logs", debouncedSearch, status, page],
    queryFn: () =>
      getVerificationLogs({
        data: { search: debouncedSearch, status, page, pageSize: 15 },
      }),
  });

  const getResultBadgeColor = (result: string) => {
    switch (result) {
      case "valid":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-transparent";
      case "revoked":
        return "bg-red-100 text-red-700 hover:bg-red-100 border-transparent";
      case "invalid":
        return "bg-slate-100 text-slate-700 hover:bg-slate-100 border-transparent";
      case "expired":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-transparent";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Verification Logs
        </h1>
        <p className="text-slate-500 text-sm">
          Audit trail of all certificate verification attempts globally.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by certificate number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="invalid">Invalid</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Certificate #</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>IP / Client Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  </TableRow>
                ))
              ) : data?.rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    No verification logs found.
                  </TableCell>
                </TableRow>
              ) : (
                data?.rows.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                      {format(new Date(log.verified_at), "MMM d, yyyy HH:mm:ss")}
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium">
                      {log.certificate_number || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getResultBadgeColor(log.result)}
                      >
                        {log.result}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">
                      {log.client_hash ? log.client_hash.slice(0, 16) + '…' : '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!isLoading && data && (
          <Pagination
            page={page}
            pageSize={15}
            total={data.total}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}

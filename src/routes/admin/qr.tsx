import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCertificates, regenerateToken } from "@/lib/admin.functions";
import { verificationUrl, downloadQrPng } from "@/lib/certificate-assets";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/admin/Pagination";
import { Copy, Download, RefreshCw, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/qr")({
  component: QrManagementPage,
});

function QrManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [regenModalOpen, setRegenModalOpen] = useState(false);
  const [regenId, setRegenId] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading } = useQuery({
    queryKey: ["certificates-qr", debouncedSearch, page],
    queryFn: () =>
      getCertificates({
        data: { search: debouncedSearch, status: "all", page, pageSize: 10 },
      }),
  });

  const regenMut = useMutation({
    mutationFn: (vars: { id: string }) => regenerateToken({ data: vars }),
    onSuccess: () => {
      toast.success("Token regenerated successfully");
      queryClient.invalidateQueries({ queryKey: ["certificates-qr"] });
      setRegenModalOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleCopyLink = (token: string) => {
    navigator.clipboard.writeText(verificationUrl(token));
    toast.success("Link copied");
  };

  const handleDownload = async (cert: any) => {
    try {
      await downloadQrPng(
        verificationUrl(cert.verification_token),
        `QR-${cert.certificate_number}`
      );
      toast.success("Downloaded");
    } catch (err) {
      toast.error("Failed to download QR");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          QR Codes & Links
        </h1>
        <p className="text-slate-500 text-sm">
          Manage verification tokens and download QR codes in bulk.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <Input
            placeholder="Search by certificate number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 bg-white"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Certificate #</TableHead>
                <TableHead>Token Snippet</TableHead>
                <TableHead>Token Issued</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-40" /></TableCell>
                  </TableRow>
                ))
              ) : data?.rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    No certificates found.
                  </TableCell>
                </TableRow>
              ) : (
                data?.rows.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-mono text-sm font-medium">
                      {cert.certificate_number}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">
                      {cert.verification_token.substring(0, 12)}...
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {cert.token_issued_at
                        ? format(new Date(cert.token_issued_at), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyLink(cert.verification_token)}
                          title="Copy Link"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(cert)}
                          title="Download QR"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => {
                            setRegenId(cert.id);
                            setRegenModalOpen(true);
                          }}
                          title="Regenerate Token"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/admin/certificates/$id" params={{ id: cert.id }}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
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
            pageSize={10}
            total={data.total}
            onPageChange={setPage}
          />
        )}
      </div>

      <Dialog open={regenModalOpen} onOpenChange={setRegenModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate QR Token</DialogTitle>
            <DialogDescription>
              Are you sure you want to regenerate the verification token? Existing
              QR codes and links for this certificate will become invalid immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegenModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => regenMut.mutate({ id: regenId })}
              disabled={regenMut.isPending}
            >
              Regenerate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

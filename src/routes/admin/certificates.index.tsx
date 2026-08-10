import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCertificates, revokeCertificate } from "@/lib/admin.functions";
import {
  downloadCertificatePdf,
  downloadQrPng,
  verificationUrl,
} from "@/lib/certificate-assets";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreHorizontal,
  Eye,
  FileText,
  QrCode,
  Link as LinkIcon,
  Ban,
  Plus,
} from "lucide-react";
import { Pagination } from "@/components/admin/Pagination";

export const Route = createFileRoute("/admin/certificates/")({
  component: CertificatesPage,
});

function CertificatesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [revokingId, setRevokingId] = useState("");
  const [revokeReason, setRevokeReason] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const { data, isLoading } = useQuery({
    queryKey: ["certificates", debouncedSearch, status, page],
    queryFn: () =>
      getCertificates({
        data: { search: debouncedSearch, status, page, pageSize: 10 },
      }),
  });

  const revokeMut = useMutation({
    mutationFn: (vars: { id: string; reason: string }) =>
      revokeCertificate({ data: vars }),
    onSuccess: () => {
      toast.success("Certificate revoked successfully");
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      setRevokeModalOpen(false);
      setRevokeReason("");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleCopyLink = (token: string) => {
    const url = verificationUrl(token);
    navigator.clipboard.writeText(url);
    toast.success("Verification link copied to clipboard");
  };

  const handleDownloadQr = async (cert: any) => {
    try {
      const url = verificationUrl(cert.verification_token);
      await downloadQrPng(url, `QR-${cert.certificate_number}`);
      toast.success("QR Code downloaded");
    } catch (e) {
      toast.error("Failed to download QR code");
    }
  };

  const handleDownloadPdf = async (cert: any) => {
    try {
      await downloadCertificatePdf({
        certificateNumber: cert.certificate_number,
        holderName: cert.holders?.name ?? 'Certificate Holder',
        title: cert.title,
        program: cert.program,
        description: cert.description,
        issuedAt: cert.issued_at,
        expiresAt: cert.expires_at,
        organization: cert.organization,
        token: cert.verification_token,
      });
      toast.success("Certificate PDF downloaded");
    } catch (e) {
      toast.error("Failed to download PDF");
    }
  };

  const openRevoke = (id: string) => {
    setRevokingId(id);
    setRevokeReason("");
    setRevokeModalOpen(true);
  };

  const submitRevoke = () => {
    if (revokingId) {
      revokeMut.mutate({ id: revokingId, reason: revokeReason });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Certificates
          </h1>
          <p className="text-slate-500 text-sm">
            Manage and issue verifiable certificates.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/certificates/new">
            <Plus className="h-4 w-4 mr-2" />
            New Certificate
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search by number or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Certificate #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Holder</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : data?.rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    No certificates found.
                  </TableCell>
                </TableRow>
              ) : (
                data?.rows.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-mono text-xs text-slate-600">
                      {cert.certificate_number}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {cert.title}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {(cert as any).holders?.name ?? '—'}
                    </TableCell>
                    <TableCell className="text-slate-600 whitespace-nowrap">
                      {format(new Date(cert.issued_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          cert.status === "valid"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-transparent"
                            : "bg-red-100 text-red-700 hover:bg-red-100 border-transparent"
                        }
                      >
                        {cert.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to="/admin/certificates/$id" params={{ id: cert.id }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDownloadPdf(cert)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadQr(cert)}>
                            <QrCode className="mr-2 h-4 w-4" />
                            Download QR
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyLink(cert.verification_token)}>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Copy Verify Link
                          </DropdownMenuItem>
                          {cert.status === "valid" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => openRevoke(cert.id)}
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Revoke Certificate
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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

      <Dialog open={revokeModalOpen} onOpenChange={setRevokeModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Revoke Certificate</DialogTitle>
            <DialogDescription>
              This action will mark the certificate as invalid in the public verification portal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Brief reason for revocation..."
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRevokeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={submitRevoke}
              disabled={revokeMut.isPending}
            >
              {revokeMut.isPending ? "Revoking..." : "Confirm Revoke"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

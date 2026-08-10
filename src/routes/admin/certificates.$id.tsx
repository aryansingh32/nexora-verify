import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCertificate,
  revokeCertificate,
  reinstateCertificate,
  regenerateToken,
} from "@/lib/admin.functions";
import {
  downloadCertificatePdf,
  downloadQrPng,
  downloadQrSvg,
  verificationUrl,
  qrDataUrl,
} from "@/lib/certificate-assets";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  FileText,
  Copy,
  Ban,
  CheckCircle,
  RefreshCw,
  Download,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/admin/certificates/$id")({
  component: CertificateDetailPage,
});

function CertificateDetailPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const [qrCode, setQrCode] = useState<string>("");

  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState("");
  const [regenModalOpen, setRegenModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["certificate", id],
    queryFn: () => getCertificate({ data: { id } }),
  });

  const cert = data?.certificate;
  const logs = data?.logs || [];

  useEffect(() => {
    if (cert?.verification_token) {
      const url = verificationUrl(cert.verification_token);
      qrDataUrl(url, 300).then(setQrCode).catch(console.error);
    }
  }, [cert?.verification_token]);

  const revokeMut = useMutation({
    mutationFn: (vars: { id: string; reason: string }) =>
      revokeCertificate({ data: vars }),
    onSuccess: () => {
      toast.success("Certificate revoked");
      queryClient.invalidateQueries({ queryKey: ["certificate", id] });
      setRevokeModalOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const reinstateMut = useMutation({
    mutationFn: (vars: { id: string }) => reinstateCertificate({ data: vars }),
    onSuccess: () => {
      toast.success("Certificate reinstated");
      queryClient.invalidateQueries({ queryKey: ["certificate", id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const regenMut = useMutation({
    mutationFn: (vars: { id: string }) => regenerateToken({ data: vars }),
    onSuccess: () => {
      toast.success("Token regenerated successfully");
      queryClient.invalidateQueries({ queryKey: ["certificate", id] });
      setRegenModalOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4">Certificate not found</h2>
        <Button asChild>
          <Link to="/admin/certificates">Back</Link>
        </Button>
      </div>
    );
  }

  const vUrl = verificationUrl(cert.verification_token);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-3 mb-2 text-slate-500">
            <Link to="/admin/certificates">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Certificates
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Certificate Details
            </h1>
            <Badge
              className={
                cert.status === "valid"
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none"
                  : "bg-red-100 text-red-700 hover:bg-red-100 shadow-none"
              }
            >
              {cert.status.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {cert.status === "valid" ? (
            <Button
              variant="destructive"
              onClick={() => setRevokeModalOpen(true)}
            >
              <Ban className="h-4 w-4 mr-2" />
              Revoke
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              onClick={() => {
                if (confirm("Are you sure you want to reinstate this certificate?")) {
                  reinstateMut.mutate({ id: cert.id });
                }
              }}
              disabled={reinstateMut.isPending}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Reinstate
            </Button>
          )}
          <Button
            onClick={() => {
              downloadCertificatePdf({
                certificateNumber: cert.certificate_number,
                holderName: (cert as any).holders?.name ?? 'Certificate Holder',
                title: cert.title,
                program: cert.program,
                description: cert.description,
                issuedAt: cert.issued_at,
                expiresAt: cert.expires_at,
                organization: cert.organization,
                token: cert.verification_token,
              })
                .then(() => toast.success("PDF Downloaded"))
                .catch(() => toast.error("PDF generation failed"));
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-500">Certificate Number</Label>
                <div className="font-mono mt-1 font-medium">{cert.certificate_number}</div>
              </div>
              <div>
                <Label className="text-slate-500">Issued To</Label>
                <div className="mt-1 font-medium">{cert.holders?.name}</div>
              </div>
              <div>
                <Label className="text-slate-500">Title</Label>
                <div className="mt-1 font-medium">{cert.title}</div>
              </div>
              <div>
                <Label className="text-slate-500">Type</Label>
                <div className="mt-1 font-medium">{cert.cert_type}</div>
              </div>
              <div>
                <Label className="text-slate-500">Issue Date</Label>
                <div className="mt-1 font-medium">
                  {format(new Date(cert.issued_at), "PPP")}
                </div>
              </div>
              <div>
                <Label className="text-slate-500">Expiry Date</Label>
                <div className="mt-1 font-medium">
                  {cert.expires_at ? format(new Date(cert.expires_at), "PPP") : "Never"}
                </div>
              </div>
            </div>

            {cert.status === "revoked" && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-md text-red-900">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <ShieldAlert className="h-4 w-4 text-red-600" />
                  Certificate Revoked
                </div>
                <p className="text-sm text-red-700">
                  Revoked on: {cert.revoked_at ? format(new Date(cert.revoked_at), "PPP") : "Unknown"}
                  <br />
                  Reason: {cert.revocation_reason || "No reason provided."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification & QR</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-4">
            {qrCode ? (
              <img
                src={qrCode}
                alt="QR Code"
                className="w-48 h-48 border border-slate-100 rounded-md p-2 bg-white"
              />
            ) : (
              <Skeleton className="w-48 h-48" />
            )}

            <div className="w-full space-y-2 pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(vUrl);
                  toast.success("URL Copied");
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => downloadQrPng(vUrl, cert.certificate_number)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PNG
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => downloadQrSvg(vUrl, cert.certificate_number)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  SVG
                </Button>
              </div>
              <Button
                variant="ghost"
                className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 mt-2"
                onClick={() => setRegenModalOpen(true)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Token
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Logs (Recent)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-slate-500 py-6">
                    No verification attempts recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.verified_at), "PPpp")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {log.result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={revokeModalOpen} onOpenChange={setRevokeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Certificate</DialogTitle>
            <DialogDescription>
              This action will mark the certificate as invalid globally.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason (Optional)</Label>
              <Textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Why is this certificate being revoked?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => revokeMut.mutate({ id: cert.id, reason: revokeReason })}
              disabled={revokeMut.isPending}
            >
              Confirm Revocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={regenModalOpen} onOpenChange={setRegenModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate Token?</DialogTitle>
            <DialogDescription>
              This will create a new verification token and invalidate all previous QR
              codes and links for this certificate. Proceed with caution.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegenModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => regenMut.mutate({ id: cert.id })}
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

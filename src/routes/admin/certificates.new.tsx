import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getHolders, upsertCertificate } from "@/lib/admin.functions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CertificateInput } from "@/lib/admin.schemas";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/certificates/new")({
  component: NewCertificatePage,
});

function NewCertificatePage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState<Omit<CertificateInput, "id">>({
    holderId: "",
    title: "",
    certType: "Completion",
    program: "",
    internshipPeriod: "",
    description: "",
    organization: "",
    issuedAt: format(new Date(), "yyyy-MM-dd"),
    expiresAt: "",
    status: "valid",
  });

  const { data: holdersData, isLoading: isLoadingHolders } = useQuery({
    queryKey: ["holders-search", search],
    queryFn: () =>
      getHolders({
        data: { search, status: "active", page: 1, pageSize: 20 },
      }),
  });

  const upsertMut = useMutation({
    mutationFn: (vars: CertificateInput) => upsertCertificate({ data: vars }),
    onSuccess: (data) => {
      toast.success("Certificate created successfully");
      navigate({ to: `/admin/certificates/${data.id}` });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.holderId) {
      toast.error("Please select a holder");
      return;
    }
    upsertMut.mutate(formData);
  };

  const selectedHolder = holdersData?.rows.find(
    (h) => h.id === formData.holderId
  );

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="-ml-3 mb-2 text-slate-500"
        >
          <Link to="/admin/certificates">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Certificates
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Issue New Certificate
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 flex flex-col">
              <Label>Holder *</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                  >
                    {selectedHolder
                      ? selectedHolder.name
                      : "Search and select a holder..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search users..."
                      value={search}
                      onValueChange={setSearch}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {isLoadingHolders ? "Searching..." : "No holder found."}
                      </CommandEmpty>
                      <CommandGroup>
                        {holdersData?.rows.map((holder) => (
                          <CommandItem
                            key={holder.id}
                            value={holder.id}
                            onSelect={(currentValue) => {
                              setFormData({
                                ...formData,
                                holderId: currentValue,
                              });
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.holderId === holder.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {holder.name} ({holder.email})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Certificate Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Full Stack Web Development"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Certificate Type *</Label>
                <Select
                  value={formData.certType}
                  onValueChange={(v) =>
                    setFormData({ ...formData, certType: v })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Completion">Completion</SelectItem>
                    <SelectItem value="Achievement">Achievement</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Participation">Participation</SelectItem>
                    <SelectItem value="Excellence">Excellence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="program">Program / Course (Optional)</Label>
                <Input
                  id="program"
                  value={formData.program}
                  onChange={(e) =>
                    setFormData({ ...formData, program: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="internshipPeriod">Internship Period (Optional)</Label>
                <Input
                  id="internshipPeriod"
                  placeholder="e.g. Jan 2026 - Mar 2026"
                  value={formData.internshipPeriod}
                  onChange={(e) =>
                    setFormData({ ...formData, internshipPeriod: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description (Optional)</Label>
              <Textarea
                id="desc"
                className="h-24"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org">Issuing Organization (Optional)</Label>
              <Input
                id="org"
                placeholder="e.g. Nexora Digital Solutions"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="issued">Issue Date *</Label>
                <Input
                  id="issued"
                  type="date"
                  value={formData.issuedAt}
                  onChange={(e) =>
                    setFormData({ ...formData, issuedAt: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires">Expiry Date (Optional)</Label>
                <Input
                  id="expires"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/certificates">Cancel</Link>
              </Button>
              <Button type="submit" disabled={upsertMut.isPending}>
                {upsertMut.isPending ? "Issuing..." : "Issue Certificate"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


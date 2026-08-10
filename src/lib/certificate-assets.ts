import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { COMPANY } from "./company";

export function verificationUrl(token: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/verify/${token}`;
}

export async function qrDataUrl(url: string, size = 640) {
  return QRCode.toDataURL(url, {
    width: size,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#1e2a44", light: "#ffffff" },
  });
}

export async function qrSvgString(url: string) {
  return QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}

export async function downloadQrPng(url: string, filename: string) {
  const dataUrl = await qrDataUrl(url, 1024);
  const res = await fetch(dataUrl);
  downloadBlob(await res.blob(), filename);
}

export async function downloadQrSvg(url: string, filename: string) {
  const svg = await qrSvgString(url);
  downloadBlob(new Blob([svg], { type: "image/svg+xml" }), filename);
}

export type CertificatePdfData = {
  certificateNumber: string;
  holderName: string;
  title: string;
  program?: string | null;
  description?: string | null;
  issuedAt: string;
  expiresAt?: string | null;
  organization: string;
  token: string;
};

const INK = "#1e2a44";
const ACCENT = "#3d4fd6";
const MUTED = "#6b7690";

export async function downloadCertificatePdf(cert: CertificatePdfData) {
  const url = verificationUrl(cert.token);
  const qr = await qrDataUrl(url, 512);
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  doc.setFillColor("#ffffff");
  doc.rect(0, 0, W, H, "F");
  doc.setDrawColor(ACCENT);
  doc.setLineWidth(3);
  doc.rect(24, 24, W - 48, H - 48);
  doc.setDrawColor("#d8dcea");
  doc.setLineWidth(0.8);
  doc.rect(34, 34, W - 68, H - 68);

  // Logo mark
  doc.setFillColor(ACCENT);
  doc.circle(70, 78, 13, "F");
  doc.setFillColor("#ffffff");
  doc.circle(70, 78, 5, "F");

  doc.setTextColor(INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(COMPANY.name, 92, 76);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text("Certificate of Recognition", 92, 90);

  doc.setTextColor(ACCENT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(cert.certificateNumber, W - 60, 78, { align: "right" });

  doc.setTextColor(MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("This is to certify that", W / 2, 160, { align: "center" });

  doc.setTextColor(INK);
  doc.setFont("times", "bold");
  doc.setFontSize(38);
  doc.text(cert.holderName, W / 2, 205, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(MUTED);
  doc.text("has been awarded", W / 2, 236, { align: "center" });

  doc.setTextColor(ACCENT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(cert.title, W / 2, 266, { align: "center", maxWidth: W - 220 });

  if (cert.program) {
    doc.setTextColor(MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(cert.program, W / 2, 288, { align: "center", maxWidth: W - 220 });
  }

  if (cert.description) {
    doc.setTextColor(INK);
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(cert.description, W - 300), W / 2, 316, { align: "center" });
  }

  // QR block
  doc.addImage(qr, "PNG", W - 168, H - 190, 104, 104);
  doc.setFontSize(7.5);
  doc.setTextColor(MUTED);
  doc.text("Scan the QR code to verify this certificate.", W - 116, H - 74, { align: "center" });

  // Signature block
  doc.setDrawColor("#b9c0d4");
  doc.setLineWidth(0.8);
  doc.line(72, H - 108, 262, H - 108);
  doc.setTextColor(INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(COMPANY.signatory, 72, H - 92);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(MUTED);
  doc.text("Authorised Signatory (demo)", 72, H - 80);

  doc.setFontSize(9);
  doc.setTextColor(INK);
  doc.text(`Issued: ${cert.issuedAt}`, 320, H - 108);
  if (cert.expiresAt) doc.text(`Valid until: ${cert.expiresAt}`, 320, H - 92);
  doc.setFontSize(8);
  doc.setTextColor(MUTED);
  doc.text(`Issued by ${cert.organization}`, 320, cert.expiresAt ? H - 78 : H - 92);

  doc.setFontSize(7);
  doc.text(url, 72, H - 52, { maxWidth: W - 260 });

  doc.save(`${cert.certificateNumber}.pdf`);
}

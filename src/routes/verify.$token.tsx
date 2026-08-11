import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { verifyCertificate, type VerificationResult } from '@/lib/verification.functions'
import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Award, Hash, Calendar, Building, Info, User } from 'lucide-react'

export const Route = createFileRoute('/verify/$token')({
  component: VerifyToken,
  head: () => ({
    meta: [
      { name: 'robots', content: 'noindex' },
      { title: 'Verify Certificate - Nexora' }
    ],
  }),
})

function HolderAvatar({ name, photoUrl, size = 104 }: { name: string; photoUrl?: string | null; size?: number }) {
  const initials = name.trim().split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div
      className="shrink-0 mx-auto z-10 relative -mt-12 border-4 border-white"
      style={{ width: size, height: size, borderRadius: '50%', boxShadow: '0 8px 32px rgba(79,70,229,0.35)' }}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{
          width: '100%', height: '100%',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.4, fontWeight: 700, color: '#fff',
        }}>
          {initials || <User size={size * 0.4} />}
        </div>
      )}
    </div>
  )
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function VerifyToken() {
  const { token } = Route.useParams()
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [showFull, setShowFull] = useState(false)
  const verify = useServerFn(verifyCertificate)

  useEffect(() => {
    verify({ data: { token } })
      .then(setResult)
      .catch((err) => {
        console.error('[verifyCertificate] server function error:', err)
        setResult({ status: 'invalid', verifiedAt: new Date().toISOString() })
      })
      .finally(() => setLoading(false))
  }, [token, verify])

  useEffect(() => {
    if (!loading && result?.status === 'valid') {
      const t = setTimeout(() => setShowFull(true), 1500)
      return () => clearTimeout(t)
    }
  }, [loading, result])

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-800 font-sans flex flex-col items-center py-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-indigo-50 to-blue-50/50 z-0"></div>
      
      {/* Header */}
      <div className="w-full max-w-lg mb-8 mt-2 flex justify-center items-center z-10 gap-2">
        <img src="/logo.png" alt="Nexora" className="h-10 w-auto object-contain" />
      </div>

      <div className={`w-full z-10 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col lg:flex-row items-center justify-center gap-8 ${showFull ? 'max-w-6xl' : 'max-w-md'}`}>
        
        {/* Main Verification Card */}
        <div className={`w-full max-w-md shrink-0 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            {loading ? (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col items-center min-h-[400px] justify-center space-y-6">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Verifying certificate...</p>
              </div>
            ) : result?.status === 'valid' || result?.status === 'expired' ? (
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative pb-6">
                {/* Banner */}
                <div className={`h-32 px-6 flex items-start pt-8 justify-center ${result.status === 'valid' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                  <div className="flex items-center gap-2 text-white font-bold tracking-widest text-sm bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
                    {result.status === 'valid' ? (
                      <>
                        <CheckCircle2 size={18} className="text-white" />
                        VERIFIED
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={18} className="text-white" />
                        EXPIRED
                      </>
                    )}
                  </div>
                </div>

                {/* Avatar */}
                <HolderAvatar name={result.certificate.holderName} photoUrl={'holderPhotoUrl' in result.certificate ? result.certificate.holderPhotoUrl : null} />

                <div className="px-6 pt-4 pb-2 text-center">
                  <h1 className="text-2xl font-bold text-slate-900 font-sora mb-1">{result.certificate.holderName}</h1>
                  {result.certificate.holderOrganization && (
                    <p className="text-sm font-medium text-slate-500">{result.certificate.holderOrganization}</p>
                  )}
                </div>

                <div className="mt-4 px-6">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                    <div className="flex gap-3 items-start">
                      <Award size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Certificate Title</p>
                        <p className="text-slate-900 font-semibold leading-snug">{result.certificate.title}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <Hash size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Certificate ID</p>
                        <p className="text-slate-900 font-medium font-mono text-sm">{result.certificate.certificateNumber}</p>
                      </div>
                    </div>

                    {result.certificate.program && (
                      <div className="flex gap-3 items-start">
                        <Info size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Program / Course</p>
                          <p className="text-slate-800 font-medium text-sm">{result.certificate.program}</p>
                        </div>
                      </div>
                    )}

                    {('internshipPeriod' in result.certificate) && result.certificate.internshipPeriod && (
                      <div className="flex gap-3 items-start">
                        <Calendar size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Internship Period</p>
                          <p className="text-slate-800 font-medium text-sm">{result.certificate.internshipPeriod}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 items-start">
                      <Calendar size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Issued On</p>
                        <p className="text-slate-800 font-medium text-sm">{fmtDate(result.certificate.issuedAt)}</p>
                      </div>
                    </div>

                    {result.certificate.expiresAt && (
                      <div className="flex gap-3 items-start">
                        <Calendar size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Expires On</p>
                          <p className={`font-medium text-sm ${result.status === 'expired' ? 'text-amber-600' : 'text-slate-800'}`}>
                            {fmtDate(result.certificate.expiresAt)}
                          </p>
                        </div>
                      </div>
                    )}

                    {result.certificate.organization && (
                      <div className="flex gap-3 items-start">
                        <Building size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Issuer</p>
                          <p className="text-slate-800 font-medium text-sm">{result.certificate.organization}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center justify-center text-center px-6">
                  <ShieldCheck size={24} className="text-emerald-500 mb-2 opacity-80" />
                  <p className="text-xs text-slate-400 font-medium">
                    Verified at {new Date(result.verifiedAt).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ) : result?.status === 'revoked' ? (
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative pb-6">
                <div className="h-32 px-6 flex items-start pt-8 justify-center bg-orange-500">
                  <div className="flex items-center gap-2 text-white font-bold tracking-widest text-sm bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
                    <AlertTriangle size={18} className="text-white" />
                    REVOKED
                  </div>
                </div>
                
                <HolderAvatar name={result.certificate.holderName} photoUrl={'holderPhotoUrl' in result.certificate ? result.certificate.holderPhotoUrl : null} />
                
                <div className="px-6 pt-4 pb-2 text-center">
                  <h1 className="text-xl font-bold text-slate-900 font-sora mb-1">{result.certificate.holderName}</h1>
                  <p className="text-sm text-slate-500 mb-4">{result.certificate.title}</p>
                </div>

                <div className="px-6">
                  <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                    <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2 text-sm">
                      <AlertTriangle size={16} />
                      Certificate Revoked
                    </h3>
                    {result.revokedAt && (
                      <p className="text-sm text-orange-700 mb-1">
                        <span className="font-medium">Date:</span> {fmtDate(result.revokedAt)}
                      </p>
                    )}
                    {result.revocationReason && (
                      <p className="text-sm text-orange-700">
                        <span className="font-medium">Reason:</span> {result.revocationReason}
                      </p>
                    )}
                    <p className="text-xs text-orange-600/80 mt-3 pt-3 border-t border-orange-200/50">
                      This certificate is no longer valid. Contact the issuer {result.certificate.organization ? `(${result.certificate.organization})` : ''} for more information.
                    </p>
                  </div>
                </div>
              </div>
            ) : result?.status === 'invalid' ? (
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <XCircle size={40} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-sora mb-3">Invalid Certificate</h2>
                <p className="text-slate-500 mb-6 leading-relaxed">
                  This certificate token is invalid or does not exist in our verification database.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl w-full border border-slate-100 text-left">
                  <p className="text-xs font-mono text-slate-500 break-all text-center">Token: {token}</p>
                </div>
              </div>
            ) : result?.status === 'rate_limited' ? (
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <AlertTriangle size={40} className="text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-sora mb-3">Rate Limited</h2>
                <p className="text-slate-500 leading-relaxed">
                  Too many verification attempts. Please try again shortly.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Trust/Verification Dashboard Render */}
        {showFull && result?.status === 'valid' && (
          <div className="w-full max-w-lg shrink-0 animate-in fade-in slide-in-from-right-8 duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] fill-mode-both delay-300">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-100/50 border border-white p-8 relative overflow-hidden">
              {/* Decorative Trust Elements */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-50 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-50 rounded-full blur-2xl"></div>

              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-sora">Authenticity Verified</h2>
                  <p className="text-sm text-slate-500 font-medium">Cryptographic Certificate Record</p>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 transition-all hover:shadow-md">
                  <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Issuer Identity Verified</p>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">This certificate was officially issued by <strong>{result.certificate.organization || "an authorized issuer"}</strong> and their identity has been cryptographically confirmed.</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 transition-all hover:shadow-md">
                  <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Hash size={18} />
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-semibold text-slate-900">Immutable Record</p>
                    <p className="text-xs text-slate-500 mt-1.5 mb-3 leading-relaxed">The certificate data matches the immutable record generated at the time of issuance.</p>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 w-full overflow-hidden">
                      <p className="text-[10px] text-slate-400 font-mono break-all line-clamp-2">
                        {token}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 transition-all hover:shadow-md">
                  <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Timestamp Validated</p>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Issued on <strong>{fmtDate(result.certificate.issuedAt)}</strong>. The timestamp integrity has been verified and remains valid.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs font-medium text-slate-400 z-10 pb-8 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-1.5 justify-center mb-1">
          <ShieldCheck size={14} className="text-indigo-400" />
          <span className="uppercase tracking-widest text-[10px] text-slate-500">Secure Verification</span>
        </div>
        <p>Verification provided by Nexora Digital Solutions Private Limited</p>
      </div>
    </div>
  )
}

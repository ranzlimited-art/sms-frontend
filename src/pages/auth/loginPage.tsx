import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// import { login, getInstitution } from '../../api/auth/auth';
// import { persistSession } from '../../api/auth/authSession';
// import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { EyeIcon } from '../../components/icons/EyeIcon';
import { AlertIcon } from '../../components/icons/AlertIcon';
import { REDIRECT_MAP, PRIMARY, CAROUSEL_IMAGES, CAROUSEL_INTERVAL_MS } from '../../config/constants';
// import type { InstitutionSetting } from '../../api/auth/types';
import { ApiError } from '../../api/client';
import { useAuth } from '../../auth/authContext';



export default function LoginPage() {
  const navigate = useNavigate();
  const { login, institution } = useAuth();
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeSlide, setActiveSlide] = useState(0);
 
  // Online/offline banner.
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);
 
  // Carousel autoplay.
  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveSlide((s) => (s + 1) % CAROUSEL_IMAGES.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);
 
  const institutionName = institution?.name ?? 'School Management System';
  const institutionShort = institution?.short_name ?? institution?.name ?? 'SMS';
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});
 
    if (!isOnline) {
      setErrorMessage('You appear to be offline. Connect to the internet to sign in.');
      return;
    }
 
    setLoading(true);
    try {
      const redirectHint = await login(email, password, remember);
      navigate(REDIRECT_MAP[redirectHint] ?? '/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.errors ?? {});
        setErrorMessage(err.errors?.email?.[0] ?? err.message);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }
 
  return (
    <main
      className="flex min-h-screen flex-col bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.35), rgba(15, 23, 42, 0.35)), url(${CAROUSEL_IMAGES[0].src})`,
      }}
    >
      <div className="flex min-h-screen flex-1 items-center justify-center p-4">
        <div className="relative w-full max-w-[1000px]">
          {/* Floating logo badge, desktop only */}
          <div
            className="absolute left-1/2 top-1/2 z-20 hidden h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 shadow-xl lg:flex"
            style={{ border: `4px solid ${PRIMARY}`, outline: '3px solid #a8c8f0', outlineOffset: '2px' }}
          >
            {institution?.logo_url ? (
              <img src={institution.logo_url} alt={`${institutionShort} logo`} className="h-20 w-20 object-contain" />
            ) : (
              <span className="text-lg font-bold" style={{ color: PRIMARY }}>
                {institutionShort.slice(0, 3).toUpperCase()}
              </span>
            )}
          </div>
 
          <div className="grid overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid-cols-2">
            {/* ── Form column ─────────────────────────────────────────── */}
            <div className="order-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:order-1 lg:py-16">
              <div className="mx-auto w-full max-w-[380px]">
                <h1 className="text-center text-2xl font-bold text-slate-900">Welcome back!</h1>
                <p className="mb-6 text-center text-sm font-semibold text-slate-500">Login</p>
                <p className="mb-4 text-sm font-bold text-slate-700">Login to your account</p>
 
                {!isOnline && (
                  <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                    <AlertIcon />
                    You're offline — sign in needs a connection.
                  </div>
                )}
 
                {errorMessage && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    <span className="mt-0.5">
                      <AlertIcon />
                    </span>
                    <span>{errorMessage}</span>
                  </div>
                )}
 
                <form onSubmit={handleSubmit} noValidate>
                  {/* Email */}
                  <div className="mb-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      autoComplete="email"
                      autoFocus
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                        fieldErrors.email
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-slate-300 focus:border-[--primary] focus:ring-blue-100'
                      }`}
                      style={{ ['--primary' as any]: PRIMARY }}
                    />
                    {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email[0]}</p>}
                  </div>
 
                  {/* Password */}
                  <div className="mb-3">
                    <div
                      className={`flex items-center rounded-lg border transition focus-within:ring-2 ${
                        fieldErrors.password
                          ? 'border-red-400 focus-within:ring-red-200'
                          : 'border-slate-300 focus-within:ring-blue-100'
                      }`}
                    >
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-l-lg px-3.5 py-2.5 text-sm text-slate-900 outline-none"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="flex h-full items-center rounded-r-lg border-l border-slate-300 px-3 text-slate-500 hover:bg-slate-50"
                      >
                        <EyeIcon off={showPassword} />
                      </button>
                    </div>
                    {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password[0]}</p>}
                  </div>
 
                  {/* Remember & forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300"
                        style={{ accentColor: PRIMARY }}
                      />
                      Remember me
                    </label>
                    <a href="#" className="text-xs font-medium" style={{ color: PRIMARY }}>
                      Forgot password?
                    </a>
                  </div>
 
                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
                    style={{ backgroundColor: PRIMARY }}
                  >
                    {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                    {loading ? 'Logging in…' : 'Login'}
                  </button>
                </form>
 
                <p className="mt-10 text-center text-xs text-slate-400">Developed by Ranz Company Limited</p>
              </div>
            </div>
 
            {/* ── Carousel column ─────────────────────────────────────── */}
            <div className="relative order-0 hidden overflow-hidden lg:order-2 lg:block" style={{ backgroundColor: PRIMARY }}>
              {CAROUSEL_IMAGES.map((slide, i) => (
                <div
                  key={slide.src}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                    i === activeSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ backgroundImage: `url(${slide.src})` }}
                  aria-hidden={i !== activeSlide}
                />
              ))}
 
              {/* Overlay for legibility */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.15) 35%, rgba(15,23,42,0.65) 100%)',
                }}
              />
 
              <div className="relative flex h-full flex-col items-center justify-between px-8 py-10 text-center">
                <div>
                  <h2 className="text-xl font-bold tracking-wide text-white">{institutionName.toUpperCase()}</h2>
                  <p className="mt-1 text-sm text-white/80">School Management System</p>
                  {institution?.motto && <p className="mt-1 text-xs text-white/60">{institution.motto}</p>}
                  <hr className="mx-auto mt-2 w-16 border-white/30" />
                </div>
 
                <p key={activeSlide} className="max-w-xs text-sm font-medium text-white/90 [animation:fade-in_0.6s_ease]">
                  {CAROUSEL_IMAGES[activeSlide].caption}
                </p>
 
                {/* Dots */}
                <div className="flex items-center gap-2">
                  {CAROUSEL_IMAGES.map((slide, i) => (
                    <button
                      key={slide.src}
                      type="button"
                      aria-label={`Show slide ${i + 1}`}
                      onClick={() => setActiveSlide(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
 
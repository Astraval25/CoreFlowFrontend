import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import connectBusiness from '../../assets/connect-business.jpg';
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import { MdOutlineVerified, MdOutlinePeople, MdLanguage } from "react-icons/md";

const featureIcons = [HiOutlineGlobeAlt, MdOutlineVerified, MdOutlinePeople];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'hi', label: 'हिन्दी' },
];

const ProductLandingPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];
  const features = t('features.items', { returnObjects: true });

  return (
      <div
          className="min-h-screen flex flex-col"
          style={{ background: "#f0f7f1" }}
      >
          {/* Nav */}
          <header className="w-full py-5 px-6 md:px-12 flex items-center justify-between">
              <div
                  className="text-2xl font-extrabold tracking-tight"
                  style={{ color: "#2f7a47" }}
              >
                  CoreFlow
              </div>

              <div className="flex items-center gap-3">
                  {/* Language switcher */}
                  <div className="relative">
                      <button
                          onClick={() => setLangOpen((p) => !p)}
                          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                          style={{
                              background:
                                  "linear-gradient(135deg, #2f7a47, #3d9e5f)",
                              color: "#fff",
                              boxShadow: langOpen
                                  ? "0 0 0 3px rgba(47,122,71,0.35), 0 4px 15px rgba(47,122,71,0.4)"
                                  : "0 0 0 2px rgba(47,122,71,0.2), 0 2px 8px rgba(47,122,71,0.25)",
                          }}
                      >
                          <MdLanguage size={17} />
                          {currentLang.label}
                          <span style={{ fontSize: "10px", opacity: 0.8 }}>
                              {langOpen ? "▲" : "▼"}
                          </span>
                      </button>

                      {langOpen && (
                          <div
                              className="absolute right-0 mt-2 rounded-2xl overflow-hidden z-50"
                              style={{
                                  background: "#fff",
                                  border: "1.5px solid rgba(47,122,71,0.2)",
                                  boxShadow:
                                      "0 8px 30px rgba(47,122,71,0.18), 0 2px 8px rgba(0,0,0,0.08)",
                                  minWidth: "145px",
                              }}
                          >
                              {languages.map((lang) => {
                                  const active = i18n.language === lang.code;
                                  return (
                                      <button
                                          key={lang.code}
                                          onClick={() =>
                                              changeLanguage(lang.code)
                                          }
                                          className="w-full text-left px-4 py-3 text-sm flex items-center justify-between gap-2 transition-all"
                                          style={{
                                              color: active
                                                  ? "#2f7a47"
                                                  : "#1a2e1a",
                                              fontWeight: active
                                                  ? "700"
                                                  : "400",
                                              background: active
                                                  ? "rgba(47,122,71,0.08)"
                                                  : "#fff",
                                              borderLeft: active
                                                  ? "3px solid #2f7a47"
                                                  : "3px solid transparent",
                                          }}
                                          onMouseEnter={(e) => {
                                              if (!active)
                                                  e.currentTarget.style.background =
                                                      "rgba(47,122,71,0.04)";
                                          }}
                                          onMouseLeave={(e) => {
                                              if (!active)
                                                  e.currentTarget.style.background =
                                                      "#fff";
                                          }}
                                      >
                                          {lang.label}
                                          {active && (
                                              <span
                                                  style={{
                                                      width: 7,
                                                      height: 7,
                                                      borderRadius: "50%",
                                                      background: "#2f7a47",
                                                      display: "inline-block",
                                                  }}
                                              />
                                          )}
                                      </button>
                                  );
                              })}
                          </div>
                      )}
                  </div>

                  <button
                      onClick={() => navigate("/cf/auth/login")}
                      className="text-sm font-semibold px-5 py-2 rounded-lg transition"
                      style={{
                          color: "#2f7a47",
                          border: "1.5px solid #2f7a47",
                      }}
                      onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#2f7a47";
                          e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#2f7a47";
                      }}
                  >
                      {t("nav.login")}
                  </button>
              </div>
          </header>

          {/* Hero — two column */}
          <section
              className="w-full px-6 md:px-12 py-16"
              style={{
                  background:
                      "linear-gradient(135deg, #f0f7f1 0%, #e8f3ea 100%)",
              }}
          >
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
                  {/* Left: text */}
                  <div className="flex-1 text-left">
                      <div
                          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6"
                          style={{
                              background: "rgba(47,122,71,0.08)",
                              color: "#2f7a47",
                          }}
                      >
                          <span
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{ background: "#2f7a47" }}
                          />
                          {t("badge")}
                      </div>

                      <h1
                          className="text-4xl md:text-5xl font-extrabold leading-tight mb-5"
                          style={{ color: "#1a2e1a" }}
                      >
                          {t("hero.title1")}{" "}
                          <span style={{ color: "#2f7a47" }}>
                              {t("hero.title2")}
                          </span>
                          <br />
                          <span
                              className="text-3xl md:text-4xl font-bold"
                              style={{ color: "#3d6b4a" }}
                          >
                              {t("hero.subtitle")}
                          </span>
                      </h1>

                      <p
                          className="text-base md:text-lg leading-relaxed mb-4"
                          style={{ color: "#5a6b5a" }}
                      >
                          {t("hero.desc1")}
                      </p>
                      <p
                          className="text-base md:text-lg leading-relaxed mb-8"
                          style={{ color: "#5a6b5a" }}
                      >
                          {t("hero.desc2")}
                      </p>

                      {/* WhatsApp CTA */}
                      <p
                          className="text-base font-semibold mb-4"
                          style={{ color: "#1a2e1a" }}
                      >
                          {t("waitlist.cta")}
                      </p>
                      <a
                          href={`https://wa.me/919043368684?text=${encodeURIComponent(t("waitlist.message"))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 rounded-xl px-7 py-4 text-sm font-bold text-white transition"
                          style={{
                              background: "#25D366",
                              boxShadow: "0 4px 15px rgba(37,211,102,0.35)",
                          }}
                          onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#1ebe5d";
                          }}
                          onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#25D366";
                          }}
                      >
                          <svg
                              viewBox="0 0 24 24"
                              width="20"
                              height="20"
                              fill="white"
                          >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.186-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.878 9.878 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.861 9.861 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z" />
                          </svg>
                          {t("waitlist.button")}
                      </a>
                      <p className="text-xs mt-4" style={{ color: "#8a9b8a" }}>
                          {t("waitlist.note")}
                      </p>
                  </div>

                  {/* Right: image */}
                  <div className="flex-1 flex justify-center">
                      <img
                          src={connectBusiness}
                          alt="Connect your business network"
                          className="rounded-2xl shadow-xl w-full object-cover"
                          style={{
                              maxWidth: "560px",
                              height: "420px",
                              border: "2px solid rgba(47,122,71,0.12)",
                          }}
                      />
                  </div>
              </div>
          </section>

          {/* Features */}
          <section className="py-20 px-6" style={{ background: "#fff" }}>
              <div className="max-w-6xl mx-auto">
                  <h2
                      className="text-2xl font-bold text-center mb-12"
                      style={{ color: "#1a2e1a" }}
                  >
                      {t("features.heading")}{" "}
                      <span style={{ color: "#2f7a47" }}>
                          {t("features.headingAccent")}
                      </span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Array.isArray(features) &&
                          features.map(({ title, desc }, i) => {
                              const Icon = featureIcons[i];
                              return (
                                  <div
                                      key={title}
                                      className="rounded-2xl p-7 flex flex-col gap-4"
                                      style={{
                                          background: "#f4faf6",
                                          border: "1px solid rgba(47,122,71,0.12)",
                                      }}
                                  >
                                      <div
                                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                                          style={{
                                              background: "rgba(47,122,71,0.1)",
                                          }}
                                      >
                                          <Icon
                                              size={26}
                                              style={{ color: "#2f7a47" }}
                                          />
                                      </div>
                                      <h3
                                          className="font-bold text-base"
                                          style={{ color: "#1a2e1a" }}
                                      >
                                          {title}
                                      </h3>
                                      <p
                                          className="text-sm leading-relaxed"
                                          style={{ color: "#5a6b5a" }}
                                      >
                                          {desc}
                                      </p>
                                  </div>
                              );
                          })}
                  </div>
              </div>
          </section>

          {/* Pills */}
          <section className="py-10 px-6" style={{ background: "#f0f7f1" }}>
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                  {t("pills", { returnObjects: true }).map((f) => (
                      <span
                          key={f}
                          className="rounded-full px-4 py-2 text-xs font-medium"
                          style={{
                              background: "#fff",
                              color: "#3d6b4a",
                              border: "1px solid rgba(47,122,71,0.18)",
                          }}
                      >
                          {f}
                      </span>
                  ))}
              </div>
          </section>

          {/* Footer */}
          <footer className="py-6 text-center" style={{ background: "#fff" }}>
              <p className="text-xs" style={{ color: "#8a9b8a" }}>
                  &copy; {new Date().getFullYear()} {t("footer")}
              </p>
          </footer>
      </div>
  );
};

export default ProductLandingPage;

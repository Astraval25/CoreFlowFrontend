import { useEffect, useMemo, useState } from "react";
import {
  MdCall,
  MdEmail,
  MdFacebook,
  MdKeyboardArrowDown,
  MdLocationOn,
  MdOutlineSearch,
} from "react-icons/md";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { coreApi } from "../../../shared/services/coreApi";

const fileUrl = (fsId) =>
  fsId ? `${import.meta.env.VITE_BASE_URL}/file?fsId=${encodeURIComponent(fsId)}` : "";

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const MarketplaceCompanyItemsPage = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [items, setItems] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      setLoading(true);
      try {
        const [companyRes, itemsRes] = await Promise.all([
          coreApi.getMarketplaceCompanyDetail(companyId),
          coreApi.getMarketplaceCompanyItems(companyId),
        ]);
        if (!cancelled) {
          setCompany(companyRes?.data?.responseData || null);
          setItems(itemsRes?.data?.responseData || []);
        }
      } catch (error) {
        console.error("Failed to fetch marketplace company details:", error);
        if (!cancelled) {
          setCompany(null);
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  const filteredItems = useMemo(() => {
    const q = globalFilter.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        String(item.itemName || "").toLowerCase().includes(q) ||
        String(item.itemType || "").toLowerCase().includes(q) ||
        String(item.salesDescription || "").toLowerCase().includes(q)
    );
  }, [items, globalFilter]);

  const brandName = company?.companyName || "Company Portfolio";
  const collectionTitle = company?.industry || "Products";
  const logoUrl = fileUrl(company?.fsId);
  const websiteUrl = company?.website
    ? /^https?:\/\//i.test(company.website)
      ? company.website
      : `https://${company.website}`
    : "";

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-white text-[#111719]">
      <div className="h-9 bg-[#285a22] text-white/90 text-[11px] md:text-xs font-semibold flex items-center justify-center px-4">
        Welcome to {brandName}. Explore products and connect for business.
      </div>

      <header className="h-[78px] bg-white flex items-center border-b border-[#f0f0f0]">
        <div className="w-full px-5 md:px-7 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex items-center min-w-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${brandName} logo`}
                className="h-12 max-w-[190px] object-contain"
              />
            ) : (
              <div className="h-12 max-w-[190px] flex items-center">
                <span className="text-2xl font-bold text-[#285a22] truncate">{brandName}</span>
              </div>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#1f282b]">
            <button
              type="button"
              onClick={() => scrollToSection("products")}
              className="inline-flex items-center gap-1 hover:text-[#285a22] transition-colors"
            >
              Products <MdKeyboardArrowDown size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="hover:text-[#285a22] transition-colors"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="hover:text-[#285a22] transition-colors"
            >
              Contact
            </button>
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#285a22] transition-colors"
              >
                Website
              </a>
            )}
          </nav>

          <div className="justify-self-end flex items-center gap-2">
            <div className="relative hidden sm:block">
              <MdOutlineSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]"
              />
              <input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search"
                className="w-36 lg:w-52 border border-transparent focus:border-[#d9dfd8] rounded-sm py-2 pl-9 pr-3 text-sm outline-none"
              />
            </div>
            <MdOutlineSearch size={24} className="sm:hidden text-[#333]" />
          </div>
        </div>
      </header>

      <main id="products" className="px-5 md:px-7 pt-14 scroll-mt-6">
        <h1 className="text-center text-[30px] md:text-[38px] font-semibold mb-[92px]">
          {collectionTitle}
        </h1>

        {loading ? (
          <div className="text-center py-16 text-[#5d665f]">Loading products...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 text-[#5d665f]">No products found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {filteredItems.map((item) => {
              const imageUrl = fileUrl(item.fsId);
              return (
                <article key={item.itemId} className="bg-white overflow-hidden">
                  <div className="relative h-[300px] bg-[#fafafa] overflow-hidden">
                    <span className="absolute top-2 left-1 z-10 rounded-full bg-[#d5f2d1] text-[#4d894d] text-xs font-semibold px-2 py-1">
                      Save
                    </span>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.itemName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#f8f8f8]">
                        <span className="w-20 h-20 rounded-full bg-[#e6eee5] text-[#285a22] text-2xl font-bold flex items-center justify-center">
                          {(item.itemName || "P").slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-[#f5f5f5] text-center px-4 py-5 min-h-[112px]">
                    <h2 className="text-[17px] font-bold leading-snug line-clamp-2">
                      {item.itemName}
                    </h2>
                    <p className="text-[22px] font-bold mt-2">
                      From Rs {formatMoney(item.salesPrice)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <section className="mt-8 border-t-2 border-[#ee4c3a] bg-[#edf5ed]">
        <div className="px-5 md:px-7 py-12 min-h-[380px] grid grid-cols-1 md:grid-cols-2 gap-10">
          <div id="about" className="scroll-mt-6">
            <h3 className="text-[18px] font-bold mb-6">About Us</h3>
            <div className="space-y-3 text-[15px] text-[#1f282b] max-w-2xl">
              <p>{company?.publicDescription || "About Us"}</p>
              {company?.contactEmail && (
                <a className="flex items-center gap-2 hover:underline" href={`mailto:${company.contactEmail}`}>
                  <MdEmail size={18} />
                  {company.contactEmail}
                </a>
              )}
              {company?.contactPhone && (
                <a className="flex items-center gap-2 hover:underline" href={`tel:${company.contactPhone}`}>
                  <MdCall size={18} />
                  {company.contactPhone}
                </a>
              )}
              {[company?.addressLine1, company?.addressLine2, company?.city, company?.state, company?.country, company?.postalCode].some(Boolean) && (
                <p className="flex items-start gap-2">
                  <MdLocationOn size={18} className="mt-0.5 shrink-0" />
                  <span>
                    {[company?.addressLine1, company?.addressLine2, company?.city, company?.state, company?.country, company?.postalCode]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div id="contact" className="md:justify-self-end md:min-w-[240px] scroll-mt-6">
            <h3 className="text-[18px] font-bold mb-8">Let's Connect</h3>
            <div className="space-y-6 text-[15px] text-[#1f282b]">
              {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noreferrer" className="block hover:underline">
                  Website
                </a>
              )}
              <p className="flex items-center gap-6"><FaTwitter size={18} /> Twitter</p>
              <p className="flex items-center gap-6"><MdFacebook size={21} /> Facebook</p>
              <p className="flex items-center gap-6"><FaInstagram size={18} /> Instagram</p>
              <p className="flex items-center gap-6"><FaYoutube size={20} /> Youtube</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#edf5ed] border-t border-[#d8e5d8] text-center py-8 text-sm font-semibold text-[#3a443d]">
        (c) 2026, {brandName}
      </footer>
    </div>
  );
};

export default MarketplaceCompanyItemsPage;

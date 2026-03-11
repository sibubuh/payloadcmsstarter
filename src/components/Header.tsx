'use client'
import React, { useState } from 'react'

export default function Header({
  headerData,
  siteSettings,
}: {
  headerData: any
  siteSettings: any
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null)

  const toggleMobileDropdown = (id: string) => {
    setOpenMobileDropdown(openMobileDropdown === id ? null : id)
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50">
      {/* Container Utama Navigasi */}
      <div className="border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
          {/* LOGO */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-2xl font-black text-blue-600 tracking-tight flex items-center gap-2"
            >
              {siteSettings?.logo?.url ? (
                <img
                  src={siteSettings.logo.url}
                  alt={siteSettings.logo.alt || siteSettings.siteName || 'Logo'}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              )}
            </a>
          </div>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center h-full">
            {headerData?.navItems?.map((item: any) => {
              const hasSubMenu = item.subMenu?.length > 0

              return (
                <div key={item.id} className="group h-full flex items-center">
                  {/* Parent Link */}
                  <a
                    href={item.link}
                    className="px-5 h-full flex items-center gap-2 text-[15px] font-bold text-gray-800 group-hover:text-blue-700 relative transition-colors"
                  >
                    {item.label}
                    {hasSubMenu && (
                      <svg
                        className="w-4 h-4 transition-transform group-hover:rotate-180 opacity-70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                    {/* Active/Hover Indicator Line */}
                    <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-blue-700 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </a>

                  {/* FULL-WIDTH SUBMENU (Gaya seperti di gambar) */}
                  {hasSubMenu && (
                    <div className="absolute left-0 top-[80px] w-full bg-white border-b border-gray-100 shadow-sm invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-40">
                      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap gap-x-12 gap-y-4 justify-start">
                        {item.subMenu.map((sub: any) => (
                          <a
                            key={sub.id}
                            href={sub.link}
                            className="text-[15px] font-semibold text-gray-700 hover:text-blue-700 py-1 relative group/sub"
                          >
                            {sub.label}
                            {/* Submenu Indicator Line */}
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-700 scale-x-0 group-hover/sub:scale-x-100 transition-transform origin-left" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* HAMBURGER (MOBILE) */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      <div
        className={`md:hidden absolute left-0 top-full w-full bg-white border-t border-gray-100 shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 flex flex-col">
          {headerData?.navItems?.map((item: any) => {
            const hasSubMenu = item.subMenu?.length > 0
            return (
              <div key={item.id} className="py-2">
                {hasSubMenu ? (
                  <>
                    <button
                      onClick={() => toggleMobileDropdown(item.id)}
                      className="w-full flex justify-between items-center py-3 text-lg font-bold text-gray-800"
                    >
                      {item.label}
                      <svg
                        className={`w-5 h-5 transition-transform ${openMobileDropdown === item.id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openMobileDropdown === item.id ? 'max-h-96' : 'max-h-0'}`}
                    >
                      <div className="pl-4 flex flex-col gap-3 pb-4 border-l-2 border-blue-100 ml-1">
                        {item.subMenu.map((sub: any) => (
                          <a
                            key={sub.id}
                            href={sub.link}
                            className="text-gray-600 font-semibold hover:text-blue-600 transition-transform hover:translate-x-2"
                          >
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <a href={item.link} className="block py-3 text-lg font-bold text-gray-800">
                    {item.label}
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </header>
  )
}

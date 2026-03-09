import React from 'react' // ← tambahkan di paling atas

export default function Header({ data }: { data: any }) {
  return (
    <>
      <nav className="flex gap-6 p-4 bg-white shadow">
        {data.navItems.map((item: any) => (
          <div key={item.id} className="group relative">
            <a href={item.link} className="font-bold">
              {item.label}
            </a>

            {/* Dropdown Menu */}
            {item.subMenu && (
              <ul className="absolute hidden group-hover:block bg-gray-50 p-2 shadow-lg min-w-[150px]">
                {item.subMenu.map((sub: any) => (
                  <li key={sub.id} className="hover:text-blue-600">
                    <a href={sub.link}>{sub.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}

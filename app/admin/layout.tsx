import AdminNav from "@/components/admin-nav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <AdminNav />
      <main className="flex-1 lg:ml-56 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}

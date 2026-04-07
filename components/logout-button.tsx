"use client"

export default function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" })
        window.location.href = "/admin/login"
      }}
      className="text-xs text-gray-500 hover:text-gray-300 border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors"
    >
      Sign Out
    </button>
  )
}

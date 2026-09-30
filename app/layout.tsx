import type { Metadata } from "next"

export const metadata: Metadata = { title: "VIVA — Living Virtual Pet World", description: "Enter. Connect. Play. Escape." }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html> }

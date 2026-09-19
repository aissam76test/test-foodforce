import "./globals.css";
import type { ReactNode } from "react";
export const metadata={title:"FoodForce FFAPP",description:"FoodForce — extras & établissements"};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="fr"><body>{children}</body></html>}
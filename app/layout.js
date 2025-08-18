import "./globals.css";
import Header from "@/components/Header";
import SessionWrapper from "@/components/SessionWrapper";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { SearchProvider } from "@/context/SearchContext";
import OverlayButton from "@/components/OverlayButton";
import GoogleTranslate from "@/components/GoogleTranslate";


export const metadata = {
  metadataBase: new URL("https://hotelmahadevrishikesh.com"),
  title: {
    default: "Stay Blessed in the Heart of Rishikesh.At Hotel Mahadev Rishikesh, every moment is crafted to offer you more than just a stay—it’s an experience. ",
    template: "%s | Hotel Mahadev",
  },
  description:
    "Stay Blessed in the Heart of Rishikesh.At Hotel Mahadev Rishikesh, every moment is crafted to offer you more than just a stay—it’s an experience. Nestled in the serene beauty of the Himalayas and blessed by the sacred Ganga, we bring together comfort, warmth, and divine tranquility. Whether you seek relaxation, adventure, or spiritual connection, your journey begins with us—where hospitality meets harmony",
  keywords:
    "hotel mahadev rishikesh, Yoga, website, rishikesh yoga,meditation, Ayurveda, india, India",
  icons: { apple: "/apple-touch-icon.png" },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Hotel Mahadev - Yoga, Meditation, Ayurveda",
    description:
      "Stay Blessed in the Heart of Rishikesh.At Hotel Mahadev Rishikesh, every moment is crafted to offer you more than just a stay—it’s an experience. Nestled in the serene beauty of the Himalayas and blessed by the sacred Ganga, we bring together comfort, warmth, and divine tranquility. Whether you seek relaxation, adventure, or spiritual connection, your journey begins with us—where hospitality meets harmony",
    images: ["/logo.png"],
    url: "https://hotelmahadevrishikesh.com/",
    site_name: "Hotel Mahadev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Mahadev - Yoga, Meditation, Ayurveda",
    description:
      "Stay Blessed in the Heart of Rishikesh.At Hotel Mahadev Rishikesh, every moment is crafted to offer you more than just a stay—it’s an experience. Nestled in the serene beauty of the Himalayas and blessed by the sacred Ganga, we bring together comfort, warmth, and divine tranquility. Whether you seek relaxation, adventure, or spiritual connection, your journey begins with us—where hospitality meets harmony   Our wellness retreat packages are thoughtfully designed to rejuvenate your body, mind, and spirit amidst the tranquil beauty of the Himalayas. Each retreat offers a holistic blend of daily yoga and meditation sessions led by experienced instructors",
    images: ["/logo.png"],
  },
  other: {
    "author": "Hotel Mahadev",
    "robots": "index, follow",
    "viewport": "width=device-width, initial-scale=1",
  },
};

export default function RootLayout({ children }) {
  const isPaid = process.env.NEXT_PUBLIC_IS_PAID === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-gilda`}>
        {isPaid ? (
          <>
            <NextTopLoader color="#006eff" height={3} showSpinner={false} zIndex={1600} />
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000, style: { fontFamily: "var(--font-GildaDisplay)" } }} />
            <SessionWrapper>
              <SearchProvider>
                <Header />
                <GoogleTranslate />
                <main>
                  <OverlayButton />
                  {children}
                </main>
                <Footer />
              </SearchProvider>
            </SessionWrapper>
          </>

        ) : (
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-black text-center">
              Payment Pending. Please Contact Admin.
            </h1>
          </div>
        )}
      </body>
    </html>
  );
}

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
    default: "Hotel Mahadev Rishikesh +91 9557701203 Luxury Hotel in Rishikesh - Best Hotel In Rishikesh - Budget Hotel In Rishikesh Hotel having all the amenities of the highest quality standard. Stay with Us: Hotel Mahadev ( a Boutique Hotel ) Luxury Premium Hotel in Rishikesh More Inquiry Call +91 1354053504, +91 955770120, +91 9927677716Email:  hotelmahadev.rishikesh@gmail.com Hotel Address : NH-7, Rishikesh Delhi Highway Above Reliance Store Adjacent to Neem Karoli Temple Rishikesh 249203 (Uttarakhand)",
    template: "%s | Hotel Mahadev",
  },
  description:
    "Hotel Mahadev Rishikesh, Luxury Hotel in Rishikesh, Best Hotel In Rishikesh, Budget Hotel In Rishikesh, Hotel having all the amenities of the highest quality standard. Stay with Us: Hotel Mahadev ( a Boutique Hotel ) Luxury Premium Hotel in Rishikesh More Inquiry Call +91 1354053504, +91 955770120, +91 9927677716Email:  hotelmahadev.rishikesh@gmail.com Hotel Address : NH-7, Rishikesh Delhi Highway Above Reliance Store Adjacent to Neem Karoli Temple Rishikesh 249203 (Uttarakhand)",
  keywords:
    "hotel mahadev rishikesh, Yoga, website, rishikesh yoga,meditation, Ayurveda, india, India",
  icons: { apple: "/apple-touch-icon.png" },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Hotel Mahadev - Yoga, Meditation, Ayurveda",
    description:
      "Hotel Mahadev Rishikesh, +91 9557701203 Luxury Hotel in Rishikesh, Best Hotel In Rishikesh, Budget Hotel In Rishikesh, Hotel having all the amenities of the highest quality standard. Stay with Us: Hotel Mahadev ( a Boutique Hotel ) Luxury Premium Hotel in Rishikesh More Inquiry Call +91 1354053504, +91 955770120, +91 9927677716Email:  hotelmahadev.rishikesh@gmail.com Hotel Address : NH-7, Rishikesh Delhi Highway Above Reliance Store Adjacent to Neem Karoli Temple Rishikesh 249203 (Uttarakhand)",
    images: ["/logo.png"],
    url: "https://hotelmahadevrishikesh.com/",
    site_name: "Hotel Mahadev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Mahadev - Yoga, Meditation, Ayurveda",
    description:
      "Hotel Mahadev Rishikesh, +91 9557701203 Luxury Hotel in Rishikesh, Best Hotel In Rishikesh, Budget Hotel In Rishikesh, Hotel having all the amenities of the highest quality standard. Stay with Us: Hotel Mahadev ( a Boutique Hotel ) Luxury Premium Hotel in Rishikesh More Inquiry Call +91 1354053504, +91 955770120, +91 9927677716Email:  hotelmahadev.rishikesh@gmail.com Hotel Address : NH-7, Rishikesh Delhi Highway Above Reliance Store Adjacent to Neem Karoli Temple Rishikesh 249203 (Uttarakhand)",
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

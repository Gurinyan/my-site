import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata = {
  title: "館シリーズ | 綾辻行人 ファンサイト",
  description: "綾辻行人の館シリーズを紹介するファンサイト",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={notoSerifJP.variable}>
      <body>{children}</body>
    </html>
  );
}


import { Poppins } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

const poppins = Poppins({ 
  subsets: ['latin', 'latin-ext'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']

});

export const metadata = {
  title: "GraD LMS",
  description: "Enhance your learning and teaching experience!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "#FAF7F2", paddingTop: "80px" }}
      >
        <div className="text-center max-w-md">
          <p
            className="font-serif text-[6rem] text-[#C9A96E] font-light leading-none mb-4"
            style={{ opacity: 0.3 }}
          >
            404
          </p>
          <div className="w-10 h-px bg-[#C9A96E] mx-auto mb-6 opacity-50" />
          <h1 className="font-serif text-[2rem] font-light text-[#3D2B1F] mb-3">
            Page Not Found
          </h1>
          <p className="font-sans text-sm text-[#8B7D6E] font-light mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/" className="btn-primary">
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

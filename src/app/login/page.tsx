"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("password");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@admin.com" && password === "password") {
      router.push("/content/news");
    } else {
      setError("Email hoặc mật khẩu không chính xác.");
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Panel */}
      <div className="w-full max-w-[480px] flex flex-col justify-between bg-white px-10 py-10 z-10 relative shadow-2xl">
        {/* Header Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-white rounded-md overflow-hidden">
            <img src="/logo.webp" alt="Quốc huy Việt Nam" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#14233b] text-sm tracking-tight leading-tight uppercase">
              Cổng Pháp Luật Quốc Gia
            </span>
            <span className="text-[#64748b] text-xs">Ứng dụng</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full flex-1 flex flex-col justify-center max-w-[340px] mx-auto">
          <h1 className="text-3xl font-bold text-[#14233B] mb-8">Đăng nhập</h1>

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-100">{error}</div>}
            <div>
              <input
                type="email"
                placeholder="Địa chỉ email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all text-sm"
              />
            </div>

            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all pr-12 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex items-center justify-between mt-2">
              <button
                type="submit"
                className="bg-[#5340FF] hover:bg-[#4330EF] text-white font-medium px-6 py-2.5 rounded-md transition-colors text-sm"
              >
                Đăng nhập
              </button>

              <Link href="#" className="text-sm text-gray-400 hover:text-[#5340FF] transition-colors">
                Quên mật khẩu
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
      </div>

      {/* Right Panel Graphic */}
      <div className="flex-1 relative bg-[#C41111] overflow-hidden flex items-center justify-center">
        {/* Background Graphic */}
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/backgroundCMS.png')" }}></div>
      </div>
    </div>
  );
}

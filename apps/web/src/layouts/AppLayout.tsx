import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Sidebar } from "../components/common/Sidebar";
import { GovernmentHeader } from "../components/common/GovernmentHeader";
import { DemoPipelineModal } from "../components/common/DemoPipelineModal";
import { GlobalSearchModal } from "../components/common/GlobalSearchModal";
import { CivicFooter } from "../components/civic/CivicFooter";
import { MpladsChatbot } from "../components/chat/MpladsChatbot";

export const AppLayout: React.FC = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0B0F17] text-[#1F2937] dark:text-[#F8FAFC] font-sans selection:bg-[#1F2A5A] selection:text-white transition-colors duration-200">
      {/* Primary Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen min-w-0">
        <GovernmentHeader
          onOpenDemoModal={() => setIsDemoModalOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <main
          id="main-content"
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden"
        >
          <Outlet />
        </main>

        <CivicFooter />
      </div>

      {/* Global Interactive Modals */}
      <DemoPipelineModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSuccess={() => {
          setIsDemoModalOpen(false);
          navigate("/dashboard");
          window.location.reload();
        }}
      />
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Grounded MPLADS Intelligence Assistant */}
      <MpladsChatbot />
    </div>
  );
};

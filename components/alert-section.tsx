"use client";

import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";

function AlertSection() {
  const [showAlert, setShowAlert] = useState(true);
  return showAlert ? (
    <div
      className={cn(
        "bg-[#1a2331] mx-4 flex justify-between p-[12px] rounded-[12px]",
        showAlert ? "mt-16 lg:mt-4" : ""
      )}
    >
      <div />
      <div className="inline-flex gap-3 text-white font-semibold text-[12px] md:text-[16px]">
        <div className="alert">
          <p>🕶️ Book your appointment with Dr. Smith, our experienced optometrist!</p>
        </div>
      </div>
      <div>
        <PlusIcon
          className="rotate-45 hover:cursor-pointer"
          color="#fff"
          onClick={() => setShowAlert(false)}
        />
      </div>
    </div>
  ) : (
    <div />
  );
}

export default AlertSection;

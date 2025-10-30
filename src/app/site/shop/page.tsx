"use client";

import { Suspense } from "react";
import ShopContent from "./ShopContent";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}

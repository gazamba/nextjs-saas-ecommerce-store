"use client";

import { formatter } from "@/lib/utils/utils";
import React, { useEffect, useState } from "react";

interface CurrencyProps {
  value?: string | number;
}

const Currency = ({ value }: CurrencyProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <span className="font-semibold">{formatter.format(Number(value))}</span>
  );
};

export default Currency;

"use client";

import { useEffect, useState } from "react";

import PreviewModal from "@/app/components/PreviewModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <PreviewModal />;
};

export default ModalProvider;

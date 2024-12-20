"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImShare } from "react-icons/im";
import { toast } from "./ui/use-toast";

const FormLinkShare = ({ shareUrl }: { shareUrl: string }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setShareLink(`${window.location.origin}/submit/${shareUrl}`);
    }
  }, [shareUrl]);

  if (!isMounted) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Copied!",
      description: "Link copied to the clipboard",
    });
  };

  return (
    <div className="flex items-center gap-4 flex-grow">
      <Input value={shareLink} readOnly />
      <Button className="w-[250px]" onClick={handleCopyLink}>
        <ImShare className="mr-2 w-4 h-4" />
        Share Link
      </Button>
    </div>
  );
};

export default FormLinkShare;

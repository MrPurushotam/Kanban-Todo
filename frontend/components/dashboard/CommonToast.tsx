"use client";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect } from "react";

interface CommonToastProps {
  variant?: "default" | "destructive";
  title: string;
  description: string;
}

const CommonToast = ({ variant = "default", title = "", description = "" }: CommonToastProps) => {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      variant: variant,
      title: title,
      description: description,
    });
  }, [variant, title, description, toast]);

  return null; 
};

export default CommonToast;

import React from "react";

export type NavItem = {
  name: string;
  icon: React.ReactElement;
  path?: string;
  subItems?: { name: string; path: string; icon?: React.ReactElement }[];
}; 

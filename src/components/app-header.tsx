'use client'
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Send, Square } from "lucide-react";
import { useUser ,  UserButton } from '@clerk/nextjs';

export function AppHeader(){
    const { user } = useUser();
  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center px-4">
        {/* Left section with logo */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold text-blue-600">F</span>
          <span className="text-lg">Fino AI</span>
        </div>

        {/* Center section with input */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-96"> {/* Fixed width container */}
            <Input 
              className="w-full rounded-lg pl-4 pr-10" 
              placeholder="Write prompt"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400 text-sm">⌘/</span>
            </div>
          </div>
        </div>

        {/* Right section with buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Send className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Square className="h-4 w-4" />
          </Button>
          {user && (
            <>
             <UserButton />
            </>
          )}
        </div>
      </div>
    </div>
  );
};


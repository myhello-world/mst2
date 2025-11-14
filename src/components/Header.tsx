import React from 'react';
import { Shield, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Shield className="h-8 w-8" />
            <Zap className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">XSS Challenge Lab</h1>
            <p className="text-red-100">Master Cross-Site Scripting vulnerabilities</p>
          </div>
        </div>
        <div className="mt-2 text-sm text-red-100">Created by Sandeep Kumar</div>
      </div>
    </header>
  );
}

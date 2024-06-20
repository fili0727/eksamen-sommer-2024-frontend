import React from 'react';
import Navbar from './Navbar';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-layout">
      <header>
        <Navbar />
      </header>
      <main className="page-content">{children}</main>
    </div>
  );
}

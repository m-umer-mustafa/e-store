import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} E-commerce Dashboard. All rights reserved.</p>
        <p>Built by Muhammad Omer Mustafa</p>
        <p>Disclaimer: This is a demo project for educational purposes only.</p>
      </div>
    </footer>
  );
};

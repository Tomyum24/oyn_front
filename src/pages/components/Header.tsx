import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Logo } from "@/shared/images/svg/Logo";

type NavItem = {
  label: string;
  href: string;
};

type HeaderProps = {
  navItems?: NavItem[];
};

export const Header: React.FC<HeaderProps> = ({ navItems = [] }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 md:p-6">
        {/* Логотип */}
        <Link to="/">
          <Logo  />
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm font-medium text-foreground hover:text-primary transition"
            >
              {item.label}
            </Link>
          ))}

          {/* Пример кнопки */}
          <Button size="sm" variant="secondary">
            Profile
          </Button>
        </nav>

        {/* Мобильное меню (бургер) */}
        <div className="md:hidden">
          {/* Здесь можно добавить мобильный dropdown/burger */}
          <Button size="sm" variant="outline">
            Menu
          </Button>
        </div>
      </div>
    </header>
  );
};
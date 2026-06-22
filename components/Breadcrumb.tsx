'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem { name: string; href: string }
interface BreadcrumbProps { items: BreadcrumbItem[] }

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const all = [{ name: 'Home', href: '/' }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs mb-6 flex-wrap">
      {all.map((item, i) => (
        <span key={item.href} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.25)' }} />}
          {i === all.length - 1 ? (
            <span style={{ color: 'rgba(200,146,14,0.80)' }}>{item.name}</span>
          ) : (
            <Link href={item.href} className="transition-colors" style={{ color: 'rgba(255,255,255,0.40)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#E8C040')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.40)')}>
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

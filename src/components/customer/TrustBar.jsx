import React from 'react';
import { ShieldCheck, Flame, Leaf, Clock, Truck, Award } from 'lucide-react';

export const TrustBar = () => {
  const highlights = [
    {
      icon: Flame,
      title: "Hormone-Free Chicken",
      desc: "Segar dari peternakan terpercaya tanpa suntik hormon atau pengawet."
    },
    {
      icon: ShieldCheck,
      title: "18 Secret Gourmet Spices",
      desc: "Racikan bumbu ala restoran bintang lima dengan citarasa kaya."
    },
    {
      icon: Award,
      title: "High Protein Muscle Fuel",
      desc: "Nutrisi seimbang dirancang untuk atlet dan gaya hidup aktif."
    },
    {
      icon: Truck,
      title: "Thermal Express Delivery",
      desc: "Dikemas dengan kontainer thermal menjaga kerenyahan & kehangatan."
    }
  ];

  return (
    <section className="bg-[#071B2A] border-y border-[#D8C7A1]/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {highlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-[#063B32]/30 border border-[#D8C7A1]/10 hover:border-[#D8C7A1]/40 transition-all duration-300 group">
              <div className="p-3 rounded-xl bg-[#063B32] border border-[#D8C7A1]/40 text-[#D8C7A1] group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#F7F3EA] mb-1 group-hover:text-[#D8C7A1] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#F7F3EA]/70 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

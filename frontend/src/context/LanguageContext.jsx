"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  bn: {
    // Navbar
    brand_title: "পূজা পরিক্রমা",
    brand_subtitle: "বর্ধমান সংস্করণ",
    how_it_works: "কীভাবে কাজ করে",
    pandal_list: "মণ্ডপ তালিকা",
    route_planner: "রুট প্ল্যানার",
    live_map: "লাইভ ম্যাপ",
    start_tour: "পরিক্রমা শুরু করুন",
    
    // HUD / Voice
    arrive: "আপনি {name}-এ পৌঁছে গেছেন। এখন ঠাকুর উপভোগ করুন!",
    turn_left: "বাঁদিকের রাস্তায় যান",
    turn_right: "ডানদিকের রাস্তায় যান",
    straight: "সোজা এগিয়ে চলুন",
    uturn: "ইউ-টার্ন নিন",
    meters_after: "মিটার পর",
    skip: "পরবর্তী মণ্ডপ",
    end: "শেষ করুন",
    tour_complete: "পরিক্রমা সমাপ্ত",
    distance: "দূরত্ব",
    stop: "স্টপ",
    route_builder: "রুট প্ল্যানার",
    select_pandals: "ম্যাপ থেকে মণ্ডপ বেছে নিন।",
    enable_mode: "ম্যাপ মোড খুলুন",
    exit_mode: "বন্ধ করুন",
    quick_stats: "একনজরে",
    total_pandals: "মোট মণ্ডপ",
    high_crowd: "ভিড় বেশি",
    add_to_route: "+ রুটে যোগ করুন",
    added: "✔ যোগ করা হয়েছে",
    transport_mode: "যাতায়াতের মাধ্যম",
    
    // Hero
    hero_pill: "2026 শারদোৎসব স্পেশাল — বর্ধমান সংস্করণ",
    hero_title1: "বর্ধমানের সেরা পুজো পরিক্রমা —",
    hero_title2: "এবার কোনো জ্যাম ছাড়াই সবচেয়ে শর্টেস্ট পাথে!",
    hero_desc: "আর ভিড়ের মধ্যে হারিয়ে যাওয়া বা ঘণ্টার পর ঘণ্টা জ্যামে আটকে থাকা নয়। আপনার সময় অনুযায়ী এক ক্লিকে সেরা মণ্ডপগুলোর অটোমেটিক চক্রাকার রুট বানিয়ে নিন বাংলায় ভয়েস গাইড সহ।",
    hero_btn1: "আমার রুট প্ল্যান করুন (Start Hopping)",
    hero_btn2: "সেরা প্যান্ডেলগুলো দেখুন",
    stat_verified: "ভেরিফায়েড মণ্ডপ",
    stat_lag: "সার্ভার ল্যাগ",
    stat_free: "ফ্রি ও ওপেন সোর্স",
    stat_lang: "বাংলায়",
    stat_turn: "টার্ন গাইডেন্স",
    
    // Features
    feat_title: "আমরা কী কী দিচ্ছি",
    feat_desc: "উৎসবে যোগ দিন কোনো বাধা ছাড়াই। আমাদের স্মার্ট ফিচারগুলো আপনার পরিক্রমাকে করবে আরও সহজ।",
    feat1_t: "শর্টেস্ট রাউন্ড-ট্রিপ (2-Opt TSP)",
    feat1_d: "যেখান থেকে পুজো দেখতে বেরোবেন, সমস্ত ঠাকুর দেখে সবচেয়ে কম সময়ে সেখানেই ফিরে আসবেন।",
    feat2_t: "স্মার্ট টাইম বাজেট প্ল্যানার",
    feat2_d: "আপনার হাতে ঠিক কত ঘণ্টা সময় আছে সিলেক্ট করুন; সিস্টেম নিজে থেকে সেরা মণ্ডপগুলো বেছে রুট সাজিয়ে দেবে।",
    feat3_t: "বাংলায় ভয়েস নেভিগেশন",
    feat3_d: "রাস্তায় হাঁটার সময় ফোনে বারবার তাকাতে হবে না, মোড়ে মোড়ে বাংলায় অডিও গাইডেন্স জানিয়ে দেবে কোন দিকে যাবেন।",
    feat4_t: "পুলিশ নো-এন্ট্রি ও ট্রাফিক ফিল্টার",
    feat4_d: "বর্ধমান ট্রাফিক পুলিশের সাময়িক ব্যারিকেড ও ওয়ান-ওয়ে এড়িয়ে শুধু হাঁটার নিরাপদ রুট।",
    culture_title: "বর্ধমানের ঐতিহ্য ও সংস্কৃতি",
    culture_desc1: "শতাব্দী প্রাচীন সর্বমঙ্গলা বাড়ী, ঐতিহাসিক কার্জন গেট, ১০৮ শিব মন্দির, আর বাদামতলা ও আলমগঞ্জের বর্ণাঢ্য বারোয়ারী দুর্গাপূজার অপরূপ সৌন্দর্য — সব মিলিয়ে আমাদের এই পরিক্রমা।",
    culture_desc2: "মা দুর্গার আগমনে সেজে উঠুক আমাদের এই প্রাচীন শহর।",
    
    // HowItWorks
    hiw_title: "কীভাবে ব্যবহার করবেন?",
    hiw_desc: "মাত্র তিনটি সহজ ধাপে শুরু করুন আপনার স্মার্ট পুজো পরিক্রমা",
    hiw1_t: "লোকেশন পারমিশন অন করুন",
    hiw1_d: "আপনার বর্তমান অবস্থান স্বয়ংক্রিয়ভাবে শনাক্ত হবে।",
    hiw2_t: "সময় বা ঠাকুর বেছে নিন",
    hiw2_d: "আপনার পছন্দমতো 2 ঘণ্টা বা Top-10 অপশনে ট্যাপ করুন।",
    hiw3_t: "Start Hopping!",
    hiw3_d: "ম্যাপের নীল লাইন ও বাংলা ভয়েস অনুসরণ করে উৎসব উপভোগ করুন।",
    
    // Footer
    foot_greeting: "শুভ শারদীয়ার প্রীতি, শুভেচ্ছা ও আন্তরিক অভিনন্দন।",
    foot_desc: "বর্ধমানের উৎসবপ্রেমী মানুষদের জন্য তৈরি একটি সম্পূর্ণ ফ্রি ও ওপেন সোর্স প্রজেক্ট। আসুন সবাই মিলে এক সুন্দর, সুশৃঙ্খল ও জ্যামমুক্ত পুজো উপভোগ করি।",
    foot_emergency: "জরুরি হেল্পলাইন",
    foot_police: "বর্ধমান পুলিশ কন্ট্রোল",
    foot_hospital: "বর্ধমান মেডিকেল কলেজ হাসপাতাল"
  },
  en: {
    // Navbar
    brand_title: "Puja Parikrama",
    brand_subtitle: "Bardhaman Edition",
    how_it_works: "How it Works",
    pandal_list: "Pandal List",
    route_planner: "Route Planner",
    live_map: "Live Map",
    start_tour: "Start Live Tour",
    
    // HUD / Voice
    arrive: "You have arrived at {name}. Enjoy the Puja!",
    turn_left: "Turn left",
    turn_right: "Turn right",
    straight: "Go straight",
    uturn: "Make a U-Turn",
    meters_after: "meters",
    skip: "Skip Stop",
    end: "End Tour",
    tour_complete: "Tour Complete",
    distance: "Distance",
    stop: "Stop",
    route_builder: "Route Builder",
    select_pandals: "Select pandals from the map.",
    enable_mode: "Enable Mode",
    exit_mode: "Exit Mode",
    quick_stats: "Quick Stats",
    total_pandals: "Total Pandals",
    high_crowd: "High Crowd",
    add_to_route: "+ Add to Route",
    added: "✔ Added",
    transport_mode: "Transport Mode",
    
    // Hero
    hero_pill: "2026 Sharadotsav Special — Bardhaman Edition",
    hero_title1: "The Best Durga Puja Parikrama —",
    hero_title2: "Now without any traffic on the shortest path!",
    hero_desc: "No more getting lost in crowds or stuck in traffic for hours. Build an automatic circular route of the best pandals in one click, complete with voice guidance.",
    hero_btn1: "Plan My Route (Start Hopping)",
    hero_btn2: "Explore Top Pandals",
    stat_verified: "Verified Pandals",
    stat_lag: "Server Lag",
    stat_free: "Free & Open Source",
    stat_lang: "English",
    stat_turn: "Turn Guidance",
    
    // Features
    feat_title: "What We Offer",
    feat_desc: "Join the festival without any hurdles. Our smart features make your pandal hopping easier.",
    feat1_t: "Shortest Round-Trip (2-Opt TSP)",
    feat1_d: "Start from anywhere, visit all pandals, and return in the shortest possible time.",
    feat2_t: "Smart Time Budget Planner",
    feat2_d: "Select how many hours you have; the system automatically picks the best pandals and plans the route.",
    feat3_t: "Voice Navigation",
    feat3_d: "No need to look at your phone constantly. Audio guidance at every turn will tell you where to go.",
    feat4_t: "Police No-Entry & Traffic Filters",
    feat4_d: "Avoid temporary barricades and one-ways set up by Bardhaman Traffic Police with safe walking routes.",
    culture_title: "Heritage & Culture of Bardhaman",
    culture_desc1: "The centuries-old Sarbamangala Bari, historic Curzon Gate, 108 Shiva Temples, and the vibrant Barowari Durga Pujas of Badamtala and Alamganj — all part of our parikrama.",
    culture_desc2: "May our ancient city be adorned by the arrival of Goddess Durga.",
    
    // HowItWorks
    hiw_title: "How to Use?",
    hiw_desc: "Start your smart puja parikrama in just three easy steps",
    hiw1_t: "Enable Location Permission",
    hiw1_d: "Your current location will be detected automatically.",
    hiw2_t: "Choose Time or Pandals",
    hiw2_d: "Tap on your preferred 2-hour or Top-10 options.",
    hiw3_t: "Start Hopping!",
    hiw3_d: "Follow the blue line on the map and voice guidance to enjoy the festival.",
    
    // Footer
    foot_greeting: "Warmest greetings and best wishes for Sharadiya.",
    foot_desc: "A completely free and open-source project built for the festival-loving people of Bardhaman. Let's all enjoy a beautiful, organized, and traffic-free Puja.",
    foot_emergency: "Emergency Helpline",
    foot_police: "Bardhaman Police Control",
    foot_hospital: "Bardhaman Medical College Hospital"
  },
  bng: {
    // Navbar
    brand_title: "Puja Parikrama",
    brand_subtitle: "Bardhaman Edition",
    how_it_works: "Kibhabe Kaj Kore",
    pandal_list: "Pandal List",
    route_planner: "Route Planner",
    live_map: "Live Map",
    start_tour: "Parikrama Suru Korun",
    
    // HUD / Voice
    arrive: "Apni {name}-e pouchhe gechen. Ekhon thakur upobhog korun!",
    turn_left: "Left-e turn nin",
    turn_right: "Right-e turn nin",
    straight: "Soja jaan",
    uturn: "U-Turn nin",
    meters_after: "meter por",
    skip: "Next Pandal",
    end: "Sesh korun",
    tour_complete: "Parikrama Sesh",
    distance: "Durrotto",
    stop: "Stop",
    route_builder: "Route Builder",
    select_pandals: "Map theke pandal bechhe nin.",
    enable_mode: "Enable Mode",
    exit_mode: "Exit Mode",
    quick_stats: "Quick Stats",
    total_pandals: "Total Pandals",
    high_crowd: "High Crowd",
    add_to_route: "+ Route-e Add korun",
    added: "✔ Add kora hoyeche",
    transport_mode: "Jatayater Madhyom",
    
    // Hero
    hero_pill: "2026 Sharadotsav Special — Bardhaman Edition",
    hero_title1: "Bardhaman-er Sera Pujo Parikrama —",
    hero_title2: "Ebar kono jam charai sobcheye shortest path-e!",
    hero_desc: "Ar bhirer modhye hariye jawa ba ghontar por ghonta jam-e atke thaka noy. Ek click-e sera pandal-gulor automatic circular route baniye nin voice guide shoho.",
    hero_btn1: "Amar Route Plan Korun (Start Hopping)",
    hero_btn2: "Sera Pandal-gulo dekhun",
    stat_verified: "Verified Pandal",
    stat_lag: "Server Lag",
    stat_free: "Free & Open Source",
    stat_lang: "Banglish",
    stat_turn: "Turn Guidance",
    
    // Features
    feat_title: "Amra Ki Ki Dichhi",
    feat_desc: "Utsobe jog din kono badha charai. Amader smart feature-gulo apnar parikrama ke korbe aro sohoj.",
    feat1_t: "Shortest Round-Trip (2-Opt TSP)",
    feat1_d: "Jekhan theke pujo dekhte beroben, sob thakur dekhe sobcheye kom somoye sekhanei phire asben.",
    feat2_t: "Smart Time Budget Planner",
    feat2_d: "Apnar hate thik koto ghonta somoy ache select korun; system nije theke sera pandal-gulo beche route sajiye debe.",
    feat3_t: "Voice Navigation",
    feat3_d: "Rastay hatar somoy phone-e barbar takate hobe na, more more audio guidance janiye debe kon dike jaben.",
    feat4_t: "Police No-Entry & Traffic Filter",
    feat4_d: "Bardhaman traffic police-er samoyik barricade o one-way eriye shudhu hatar nirapod route.",
    culture_title: "Bardhaman-er Aitihyo O Sonskriti",
    culture_desc1: "Shotabdi prachin Sarbamangala Bari, aitihasik Curzon Gate, 108 Shiva Temple, ar Badamtala o Alamganj-er bornaddho Barowari Durga Pujar oporup soundorjyo — sob miliye amader ei parikrama.",
    culture_desc2: "Ma Durgar agomone seje uthuk amader ei prachin sohor.",
    
    // HowItWorks
    hiw_title: "Kibhabe Byabohar Korben?",
    hiw_desc: "Matro tinti sohoj dhaap-e suru korun apnar smart pujo parikrama",
    hiw1_t: "Location Permission On Korun",
    hiw1_d: "Apnar bortoman obosthan automatically detect hobe.",
    hiw2_t: "Somoy ba Thakur beche nin",
    hiw2_d: "Apnar pochhondomoto 2-ghonta ba Top-10 option-e tap korun.",
    hiw3_t: "Start Hopping!",
    hiw3_d: "Map-er blue line o voice follow kore utsob upobhog korun.",
    
    // Footer
    foot_greeting: "Shubho Sharodiyar priti, shubhechha o antorik abhinondon.",
    foot_desc: "Bardhaman-er utsob-premi manusder jonno toiri ekti sompurno free o open-source project. Ashun sobai mile ek sundor, sushrinkhol o jam-mukt pujo upobhog kori.",
    foot_emergency: "Emergency Helpline",
    foot_police: "Bardhaman Police Control",
    foot_hospital: "Bardhaman Medical College Hospital"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('bn');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('puja_lang');
    if (saved && ['bn', 'en', 'bng'].includes(saved)) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('puja_lang', newLang);
  };

  // Translation helper
  const t = (key, params = {}) => {
    let str = translations[lang]?.[key] || translations['en']?.[key] || key;
    
    // Replace params (e.g. {name})
    Object.keys(params).forEach(p => {
      str = str.replace(`{${p}}`, params[p]);
    });
    
    return str;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

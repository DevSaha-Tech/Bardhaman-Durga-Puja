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
    tour_complete: "সফর শেষ",
    distance: "দূরত্ব",
    stop: "স্টপ",
    yes_reached: "হ্যাঁ, পৌঁছে গেছি",
    not_yet: "না, পৌঁছাইনি",
    next_pandal: "পরবর্তী মণ্ডপে চলুন ➔",
    checkin_complete: "দর্শন সম্পন্ন",
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
    
    // Hero Landing
    hero_pill: "বর্ধমান • কাটোয়া • ২০২৬",
    hero_title: "চলো, পূজো দেখতে যাই",
    hero_title_p1: "চলো,",
    hero_title_p2: "পূজো দেখতে যাই",
    hero_motto: "শুরু তোমার থেকে, শেষ তোমার কাছেই",
    hero_one_line: "সবচেয়ে কম সময়ে, কম জ্যামে — সেরা পণ্ডেলগুলো ঘুরে দেখুন। ফ্রি, লগইন ছাড়াই।",
    hero_btn_start: "পরিক্রমা শুরু করুন",
    hero_btn_hiw: "কীভাবে কাজ করে",
    hero_subline: "২৩টি মণ্ডপ · বর্ধমান ও কাটোয়া · বাংলায় ভয়েস গাইড",
    hero_stat_pandals: "২৩টি মণ্ডপ",
    hero_stat_cities: "বর্ধমান ও কাটোয়া",
    hero_stat_voice: "বাংলায় ভয়েস গাইড",

    // Section 2: Features
    feat_sec_title: "এক অ্যাপে সবকিছু",
    feat_sec_sub: "পূজো পরিক্রমার জন্য যা যা দরকার",
    feat1_card_t: "স্মার্ট রুট প্ল্যানিং",
    feat1_card_d: "কোন পণ্ডেল আগে, কোনটা পরে — সিস্টেম নিজেই সবচেয়ে কম সময়ের রুট বানিয়ে দেয়।",
    feat2_card_t: "বাংলায় ভয়েস গাইড",
    feat2_card_d: "হাঁটার সময় ফোনে তাকাতে হবে না। বাংলায় মোড়ে মোড়ে নির্দেশনা।",
    feat3_card_t: "বন্ধুদের সাথে শেয়ার",
    feat3_card_d: "রুট বানিয়ে লিংক শেয়ার করুন। বন্ধুরা এক ক্লিকে একই রুট পাবে।",

    // Section 3: How it works
    hiw_sec_title: "কীভাবে ব্যবহার করবেন?",
    hiw_sec_sub: "মাত্র ৩টি ধাপে শুরু",
    hiw_step1_n: "০১",
    hiw_step1_t: "লোকেশন চালু করুন",
    hiw_step1_d: "ব্রাউজার আপনার অবস্থান শনাক্ত করবে।",
    hiw_step2_n: "০২",
    hiw_step2_t: "সময় বেছে নিন",
    hiw_step2_d: "২ ঘণ্টা, ৪ ঘণ্টা বা সারা দিন — যতটা সময় আছে।",
    hiw_step3_n: "০৩",
    hiw_step3_t: "পরিক্রমা শুরু করুন",
    hiw_step3_d: "ম্যাপে নীল রুট অনুসরণ করুন, বাংলায় গাইড শুনুন।",
    hiw_cta_btn: "এখনই শুরু করুন",

    // Section 3.5: Why Cholo Pujo
    why_sec_title: "কেন চলো পুজো?",
    why_sec_sub: "পুজো পরিক্রমা এবার আরও সহজ, আরও আনন্দময়",
    why1_t: "সময় বাঁচান",
    why1_d: "কম জ্যামে, বেশি পণ্ডেল দেখুন।",
    why2_t: "সবার জন্য ফ্রি",
    why2_d: "কোনো লগইন নেই, কোনো বিজ্ঞাপন নেই।",
    why3_t: "যেকোনো ফোনে",
    why3_d: "অ্যাপ ডাউনলোড করার দরকার নেই।",
    why4_t: "নিজের শহর, নিজের পুজো",
    why4_d: "বর্ধমান ও কাটোয়া থেকে শুরু, আরও শহর আসছে।",

    // Section 4: Cities covered
    city_sec_title: "যেসব শহরে আছে",
    city_sec_sub: "আরও শহর যোগ হচ্ছে শীঘ্রই",
    city1_name: "বর্ধমান",
    city1_count: "১৭টি মণ্ডপ",
    city1_status: "উপলব্ধ",
    city2_name: "কাটোয়া",
    city2_count: "৬টি মণ্ডপ",
    city2_status: "উপলব্ধ",
    city3_name: "কলকাতা",
    city3_count: "শীঘ্রই আসছে",
    city3_status: "coming soon",

    // Section 5: Local businesses
    biz_sec_title: "স্থানীয় ব্যবসা",
    biz_sec_sub: "পূজো পরিক্রমার ফাঁকে কাছের দোকান, খাবারের জায়গা",
    biz_empty: "আপনার ব্যবসা এখানে দেখাতে চান? যোগাযোগ করুন: contact@devsaha.tech",

    // Section 6: Support project
    supp_sec_title: "সমর্থন জানান",
    supp_sec_sub: "এই প্রজেক্টটি সম্পূর্ণ ফ্রি এবং ওপেন সোর্স",
    supp_body: "আমরা কোনো বিজ্ঞাপন বা সাবস্ক্রিপশন নেই। যদি এই অ্যাপ আপনার পূজো পরিক্রমায় সাহায্য করে, আপনি চাইলে সামান্য অবদান রাখতে পারেন — যা পরের বছরের সার্ভার খরচ এবং আরও শহরে ছড়িয়ে দিতে কাজে লাগবে।",
    supp_qr_scan: "UPI দিয়ে স্ক্যান করুন",
    supp_qr_note: "যেকোনো পরিমাণ — ₹১০, ₹৫০, ₹১০০",
    supp_qr_soon: "QR কোড শীঘ্রই আসছে",

    // Section 7: Emergency numbers
    emerg_sec_title: "জরুরি নম্বর",
    emerg_sec_sub: "পূজোর সময় প্রয়োজন হলে",
    emerg1_name: "বর্ধমান পুলিশ কন্ট্রোল",
    emerg1_num: "১০০",
    emerg2_name: "বর্ধমান মেডিকেল কলেজ",
    emerg2_num: "১০৮",
    emerg3_name: "অ্যাম্বুলেন্স",
    emerg3_num: "১০২",
    emerg4_name: "দমকল",
    emerg4_num: "১০১",

    // Section 8: Footer
    foot_tagline: "স্মার্ট রুট, কম সময়",
    foot_init: "DevSaha Tech-এর একটি উদ্যোগ",
    foot_nav_title: "ন্যাভিগেশন",
    foot_home: "হোম",
    foot_start: "পরিক্রমা শুরু করুন",
    foot_hiw: "কীভাবে কাজ করে",
    foot_list: "পণ্ডেল তালিকা",
    foot_cities_title: "শহরসমূহ",
    foot_bwn: "বর্ধমান",
    foot_ktw: "কাটোয়া",
    foot_more: "আরও শহর (শীঘ্রই)",
    foot_contact_title: "যোগাযোগ",
    foot_email: "যোগাযোগ: contact@devsaha.tech",
    foot_feedback: "মতামত জানান",
    foot_github: "GitHub",
    foot_copy: "© ২০২৬ DevSaha Tech · সব অধিকার সংরক্ষিত",
    foot_terms: "এই সাইটটি ব্যবহার করে আপনি আমাদের শর্তাবলী মেনে নিচ্ছেন।",
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
    foot_hospital: "বর্ধমান মেডিকেল কলেজ হাসপাতাল",
    
    // Feedback
    feedback_button_aria: "মতামত জানান",
    feedback_title: "আপনার মতামত জানান",
    feedback_category_label: "বিভাগ",
    feedback_category_general: "সাধারণ মতামত",
    feedback_category_bug: "সমস্যা / বাগ",
    feedback_category_suggestion: "পরিবর্তনের প্রস্তাব",
    feedback_category_add_pandal: "নতুন মণ্ডপ যোগ করুন",
    feedback_category_data: "তথ্য সংশোধন",
    feedback_category_other: "অন্যান্য",
    feedback_pandal_name_label: "মণ্ডপের নাম",
    feedback_message_label: "আপনার মতামত",
    feedback_message_placeholder: "এখানে লিখুন...",
    feedback_submit: "পাঠান",
    feedback_cancel: "বাতিল",
    feedback_thanks: "ধন্যবাদ! আপনার মতামত আমরা পেয়েছি।",
    feedback_error: "দুঃখিত, পাঠানো যায়নি। আবার চেষ্টা করুন।",
    
    // Planner Phase 9B
    pl_time_label: "কত সময় আছে?",
    pl_time_2h: "২ ঘণ্টা",
    pl_time_4h: "৪ ঘণ্টা",
    pl_time_6h: "৬ ঘণ্টা",
    pl_time_allday: "সারা দিন",
    pl_time_other: "অন্যান্য",
    pl_more_options: "আরও বিকল্প",
    pl_start_tour: "পরিক্রমা শুরু করুন",
    pl_open_gmaps: "Google Maps-এ খুলুন",
    pl_share: "শেয়ার",
    pl_select_from_map: "ম্যাপ থেকে বাছুন",
    pl_selected_count: "{n}টি মণ্ডপ বেছেছেন",
    pl_confirm: "সম্পূর্ণ করুন",
    pl_cancel: "বাতিল",
    pl_open_first_10: "প্রথম ১০টি দিয়ে শুরু করুন",
    pl_one_by_one: "একটা একটা করে যান",
    pl_more_than_10: "১০টির বেশি মণ্ডপ Google Maps-এ একসাথে দেখানো যাবে না।",
    pl_continue_batch: "প্রথম ১০টি শেষ? পরের {n}টির জন্য ক্লিক করুন",
    share_title: "আমার পূজো পরিক্রমার রুট",
    share_text: "চলো পূজো দেখতে যাই! {n}টি মণ্ডপ",
    share_copied: "লিংক কপি হয়েছে",
    search_pandals: "মণ্ডপ খুঁজুন...",
    batch_progress: "ব্যাচ {n} / {total}",
    batch_continue: "পরেরটির জন্য ক্লিক করুন",
    batch_done_toast: "সব মণ্ডপ দেখা শেষ!"
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
    yes_reached: "Yes, Reached",
    not_yet: "Not Yet",
    next_pandal: "Next Pandal ➔",
    checkin_complete: "Check-in Complete",
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
    
    // Hero Landing
    hero_pill: "Bardhaman • Katwa • 2026",
    hero_title: "Let's go pandal hopping",
    hero_title_p1: "Let's go",
    hero_title_p2: "pandal hopping",
    hero_motto: "Start from you, end at you",
    hero_one_line: "Visit the best pandals in the shortest time with minimal traffic. Free, no login required.",
    hero_btn_start: "Start Pandal Hopping",
    hero_btn_hiw: "How it works",
    hero_subline: "23 Pandals · Bardhaman & Katwa · Voice Guide in Bengali",
    hero_stat_pandals: "23 Pandals",
    hero_stat_cities: "Bardhaman & Katwa",
    hero_stat_voice: "Voice Guide in Bengali",

    // Section 2: Features
    feat_sec_title: "Everything in one app",
    feat_sec_sub: "Everything you need for Puja parikrama",
    feat1_card_t: "Smart Route Planning",
    feat1_card_d: "Which pandal first, which later — the system automatically builds the fastest route.",
    feat2_card_t: "Voice Guide in Bengali",
    feat2_card_d: "No need to look at your phone while walking. Turn-by-turn voice instructions in Bengali.",
    feat3_card_t: "Share with Friends",
    feat3_card_d: "Build a route and share the link. Friends get the exact same route with one click.",

    // Section 3: How it works
    hiw_sec_title: "How to use?",
    hiw_sec_sub: "Start in just 3 steps",
    hiw_step1_n: "01",
    hiw_step1_t: "Turn on Location",
    hiw_step1_d: "Browser will detect your live location.",
    hiw_step2_n: "02",
    hiw_step2_t: "Select Time",
    hiw_step2_d: "2 hours, 4 hours, or all day — as much time as you have.",
    hiw_step3_n: "03",
    hiw_step3_t: "Start Parikrama",
    hiw_step3_d: "Follow the blue route on the map and listen to the Bengali guide.",
    hiw_cta_btn: "Start Now",

    // Section 3.5: Why Cholo Pujo
    why_sec_title: "Why Cholo Pujo?",
    why_sec_sub: "Puja hopping is now easier and more enjoyable",
    why1_t: "Save Time",
    why1_d: "Less traffic, see more pandals.",
    why2_t: "Free for All",
    why2_d: "No login needed, zero advertisements.",
    why3_t: "Any Smartphone",
    why3_d: "No app download required.",
    why4_t: "Our City, Our Puja",
    why4_d: "Starting with Bardhaman & Katwa, more cities coming.",

    // Section 4: Cities covered
    city_sec_title: "Cities Covered",
    city_sec_sub: "More cities coming soon",
    city1_name: "Bardhaman",
    city1_count: "17 Pandals",
    city1_status: "Available",
    city2_name: "Katwa",
    city2_count: "6 Pandals",
    city2_status: "Available",
    city3_name: "Kolkata",
    city3_count: "Coming Soon",
    city3_status: "coming soon",

    // Section 5: Local businesses
    biz_sec_title: "Local Businesses",
    biz_sec_sub: "Shops and eateries nearby during your Puja tour",
    biz_empty: "Want to feature your business here? Contact: contact@devsaha.tech",

    // Section 6: Support project
    supp_sec_title: "Support the Project",
    supp_sec_sub: "This project is 100% free and open source",
    supp_body: "We take no ads or subscriptions. If this app helps your Puja tour, you can make a small contribution to support server costs and expansion to more cities.",
    supp_qr_scan: "Scan with any UPI App",
    supp_qr_note: "Any amount — ₹10, ₹50, ₹100",
    supp_qr_soon: "QR Code Coming Soon",

    // Section 7: Emergency numbers
    emerg_sec_title: "Emergency Numbers",
    emerg_sec_sub: "For emergencies during Puja",
    emerg1_name: "Bardhaman Police Control",
    emerg1_num: "100",
    emerg2_name: "Bardhaman Medical College",
    emerg2_num: "108",
    emerg3_name: "Ambulance",
    emerg3_num: "102",
    emerg4_name: "Fire Station",
    emerg4_num: "101",

    // Section 8: Footer
    foot_tagline: "Smart routes, less time",
    foot_init: "An initiative by DevSaha Tech",
    foot_nav_title: "Navigate",
    foot_home: "Home",
    foot_start: "Start Parikrama",
    foot_hiw: "How it works",
    foot_list: "Pandal List",
    foot_cities_title: "Cities",
    foot_bwn: "Bardhaman",
    foot_ktw: "Katwa",
    foot_more: "More Cities (Soon)",
    foot_contact_title: "Contact",
    foot_email: "Contact: contact@devsaha.tech",
    foot_feedback: "Give Feedback",
    foot_github: "GitHub",
    foot_copy: "© 2026 DevSaha Tech · All rights reserved",
    foot_terms: "By using this site, you agree to our terms and conditions.",
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
    foot_hospital: "Bardhaman Medical College Hospital",
    
    // Feedback
    feedback_button_aria: "Send feedback",
    feedback_title: "Send Feedback",
    feedback_category_label: "Category",
    feedback_category_general: "General",
    feedback_category_bug: "Bug / Problem",
    feedback_category_suggestion: "Suggestion",
    feedback_category_add_pandal: "Add a Pandal",
    feedback_category_data: "Data Correction",
    feedback_category_other: "Other",
    feedback_pandal_name_label: "Pandal name",
    feedback_message_label: "Your message",
    feedback_message_placeholder: "Type here...",
    feedback_submit: "Submit",
    feedback_cancel: "Cancel",
    feedback_thanks: "Thanks! We received your feedback.",
    feedback_error: "Sorry, submission failed. Please try again.",
    
    // Planner Phase 9B
    pl_time_label: "How much time?",
    pl_time_2h: "2 hours",
    pl_time_4h: "4 hours",
    pl_time_6h: "6 hours",
    pl_time_allday: "All day",
    pl_time_other: "Other",
    pl_more_options: "More options",
    pl_start_tour: "Start Tour",
    pl_open_gmaps: "Open in Google Maps",
    pl_share: "Share",
    pl_select_from_map: "Pick from map",
    pl_selected_count: "{n} pandals selected",
    pl_confirm: "Confirm",
    pl_cancel: "Cancel",
    pl_open_first_10: "Start with first 10",
    pl_one_by_one: "One by one",
    pl_more_than_10: "Google Maps allows max 10 stops at once.",
    pl_continue_batch: "First 10 done? Tap for next {n}",
    share_title: "My Cholo Pujo route",
    share_text: "Cholo Pujo! {n} pandals",
    share_copied: "Link copied",
    search_pandals: "Search pandals...",
    batch_progress: "Batch {n} of {total}",
    batch_continue: "Tap for next batch",
    batch_done_toast: "All pandals visited!"
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
    yes_reached: "Haa, pouche gechi",
    not_yet: "Na, pouchaini",
    next_pandal: "Next Pandal ➔",
    checkin_complete: "Dorshon Somponno",
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
    
    // Hero Landing
    hero_pill: "Bardhaman • Katwa • 2026",
    hero_title: "Cholo, pujo dekhte jai",
    hero_title_p1: "Cholo,",
    hero_title_p2: "pujo dekhte jai",
    hero_motto: "Shuru tomar theke, shesh tomar kashei",
    hero_one_line: "Sobcheye kom shomoye, kom jam-e — shera pandal gulo ghure dekhun. Free, login charai.",
    hero_btn_start: "Parikrama Shuru Korun",
    hero_btn_hiw: "Kivabe kaj kore",
    hero_subline: "23-ti pandal · Bardhaman o Katwa · Bangla-y Voice Guide",
    hero_stat_pandals: "23-ti Pandal",
    hero_stat_cities: "Bardhaman o Katwa",
    hero_stat_voice: "Bangla-y Voice Guide",

    // Section 2: Features
    feat_sec_title: "Ek app-e sobkichu",
    feat_sec_sub: "Pujo parikramara jonno ja ja dorkar",
    feat1_card_t: "Smart Route Planning",
    feat1_card_d: "Kon pandal age, konta pore — system nijei sobcheye kom shomoyer route baniye dey.",
    feat2_card_t: "Bangla-y Voice Guide",
    feat2_card_d: "Hatar shomoy phone-e takate hobe na. Bangla-y more more nirdeshona.",
    feat3_card_t: "Bondhuder sathe share",
    feat3_card_d: "Route baniye link share korun. Bondhura ek click-e eki route pabe.",

    // Section 3: How it works
    hiw_sec_title: "Kivabe byabahar korben?",
    hiw_sec_sub: "Matro 3-ti dhape shuru",
    hiw_step1_n: "01",
    hiw_step1_t: "Location chalu korun",
    hiw_step1_d: "Browser tomar location shonakhto korbe.",
    hiw_step2_n: "02",
    hiw_step2_t: "Shomoy beche nin",
    hiw_step2_d: "2 ghanta, 4 ghanta ba shara din — jotota shomoy ache.",
    hiw_step3_n: "03",
    hiw_step3_t: "Parikrama shuru korun",
    hiw_step3_d: "Map-e neel route onushoron korun, Bangla-y guide shunun.",
    hiw_cta_btn: "Ekhoni shuru korun",

    // Section 4: Cities covered
    city_sec_title: "Jesob shohore ache",
    city_sec_sub: "Aro shohor jog hocche shighroi",
    city1_name: "Bardhaman",
    city1_count: "17-ti Pandal",
    city1_status: "Available",
    city2_name: "Katwa",
    city2_count: "6-ti Pandal",
    city2_status: "Available",
    city3_name: "Kolkata",
    city3_count: "Shighroi asche",
    city3_status: "coming soon",

    // Section 5: Local businesses
    biz_sec_title: "Sthaniyo Byabasa",
    biz_sec_sub: "Pujo parikramar phanke kacher dokan, khabarer jayga",
    biz_empty: "Tomar byabasa ekhane dekhate chan? Jogajog korun: contact@devsaha.tech",

    // Section 6: Support project
    supp_sec_title: "Somorthon janan",
    supp_sec_sub: "Ei project-ti shompurno free ebong open source",
    supp_body: "Amra kono obhiggyan ba subscription nei na. Jodi ei app tomar pujo parikramay shahajjo kore, tumi chaile shamanyo obodan rakhte paro.",
    supp_qr_scan: "UPI diye scan korun",
    supp_qr_note: "Jekono poriman — ₹10, ₹50, ₹100",
    supp_qr_soon: "QR Code Shighroi Asche",

    // Section 7: Emergency numbers
    emerg_sec_title: "Joruri Number",
    emerg_sec_sub: "Pujor shomoy proyojon hole",
    emerg1_name: "Bardhaman Police Control",
    emerg1_num: "100",
    emerg2_name: "Bardhaman Medical College",
    emerg2_num: "108",
    emerg3_name: "Ambulance",
    emerg3_num: "102",
    emerg4_name: "Fire Station",
    emerg4_num: "101",

    // Section 8: Footer
    foot_tagline: "Smart route, kom shomoy",
    foot_init: "DevSaha Tech-er ekti uddyog",
    foot_nav_title: "Navigation",
    foot_home: "Home",
    foot_start: "Parikrama Shuru Korun",
    foot_hiw: "Kivabe kaj kore",
    foot_list: "Pandal List",
    foot_cities_title: "Shohorshomuho",
    foot_bwn: "Bardhaman",
    foot_ktw: "Katwa",
    foot_more: "Aro Shohor (Shighroi)",
    foot_contact_title: "Jogajog",
    foot_email: "Jogajog: contact@devsaha.tech",
    foot_feedback: "Motamot janan",
    foot_github: "GitHub",
    foot_copy: "© 2026 DevSaha Tech · Sob odhikar shongrokhito",
    foot_terms: "Ei site-ti byabahar kore apni amader shortaboli mene nicchen.",
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
    foot_hospital: "Bardhaman Medical College Hospital",
    
    // Planner Phase 9B
    pl_time_label: "Koto somoy ache?",
    pl_time_2h: "2 ghonta",
    pl_time_4h: "4 ghonta",
    pl_time_6h: "6 ghonta",
    pl_time_allday: "Sara din",
    pl_time_other: "Onnanno",
    pl_more_options: "Aro bikolpo",
    pl_start_tour: "Parikrama suru korun",
    pl_open_gmaps: "Google Maps-e khulun",
    pl_share: "Share",
    pl_select_from_map: "Map theke bachun",
    pl_selected_count: "{n}ti mondop bechhechen",
    pl_confirm: "Sompurno korun",
    pl_cancel: "Batil",
    pl_open_first_10: "Prothom 10 diye suru korun",
    pl_one_by_one: "Ekta ekta kore jaan",
    pl_more_than_10: "10 tir beshi mondop Google Maps-e ekshathe dekhano jabe na.",
    pl_continue_batch: "Prothom 10 shesh? Porer {n}tir jonno click korun",
    share_title: "Amar pujo parikramar route",
    share_text: "Cholo pujo dekhte jai! {n}ti mondop",
    share_copied: "Link copy hoyeche",
    search_pandals: "Mondop khujun...",
    batch_progress: "Batch {n} / {total}",
    batch_continue: "Porer tir jonno click korun",
    batch_done_toast: "Sob mondop dekha shesh!"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('bn');

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

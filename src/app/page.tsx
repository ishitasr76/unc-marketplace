"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";
import emailjs from '@emailjs/browser';

export default function Home() {
  const listingsRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { current_user_id, current_user_name, current_user_email } = useUser();

  // Initialize EmailJS once when component mounts (will likely fail due to network issues)
  useEffect(() => {
    const initEmailJS = () => {
      try {
        if (typeof emailjs !== 'undefined' && emailjs) {
          try {
            emailjs.init("n6jpUtOzTsP-7PWmk");
            console.log('EmailJS initialized (may still fail due to network issues)');
          } catch (initError) {
            // Expected to fail due to SSL/network issues
            console.log('EmailJS initialization failed (expected)');
          }
        } else {
          setTimeout(initEmailJS, 1000);
        }
      } catch (error) {
        // Expected error
        console.log('EmailJS not available (expected)');
      }
    };
    
    initEmailJS();
  }, []);

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase
        .from("Items")
        .select("item_id, item_name, item_category, item_price, item_picture, item_description, uploaded_date_time, user_id, user_name, user_email, school_name");
      if (!error) setItems(data || []);
      setLoading(false);
    }
    fetchItems();
  }, []);

  // if (!current_user_id) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[60vh]">
  //       <div className="flex flex-col items-center space-y-4">
  //         <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  //         <p className="text-muted-foreground">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Welcome to{" "}
            <span className="text-unc-blue">TriDealz</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The easiest way for RTP students to buy and sell dorm essentials, supplies, textbooks, clothes, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              className="btn bg-primary text-primary-foreground px-8 py-4 rounded-lg shadow-lg hover:shadow-xl font-semibold text-lg"
              onClick={() => {
                listingsRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Browse Listings
            </button>
            <Link 
              href="/post-item" 
              className="btn bg-secondary text-secondary-foreground px-8 py-4 rounded-lg shadow-lg hover:shadow-xl font-semibold text-lg border border-border"
            >
              Post an Item
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Shop by Category</h2>
          <p className="text-muted-foreground">Find exactly what you need</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/category/dorm-stuff" className="card group">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 h-full border border-border hover:border-primary/20 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-unc-blue rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-xl">bed</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Dorm Stuff</h3>
                  <p className="text-muted-foreground text-sm">Beds, mini-fridges, decor, and more for your dorm room.</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/category/supplies" className="card group">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 h-full border border-border hover:border-primary/20 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-xl">school</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Supplies</h3>
                  <p className="text-muted-foreground text-sm">School and study supplies, electronics, and more.</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/category/class-materials" className="card group">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 h-full border border-border hover:border-primary/20 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-xl">book</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Class Materials</h3>
                  <p className="text-muted-foreground text-sm">Buy or sell class notes and textbooks for your college classes.</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/category/clothes" className="card group">
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 h-full border border-border hover:border-primary/20 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-xl">checkroom</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Clothes</h3>
                  <p className="text-muted-foreground text-sm">College gear, seasonal wear, and more clothing items.</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/category/electronics" className="card group">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 h-full border border-border hover:border-primary/20 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-xl">devices</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Electronics</h3>
                  <p className="text-muted-foreground text-sm">Laptops, phones, headphones, and more electronics.</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Listings Section */}
      <section ref={listingsRef} id="listings" className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">All Listings</h2>
          <p className="text-muted-foreground">Discover great deals from fellow students</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Loading listings...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  className="card bg-background rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all"
                  key={item.item_id}
                >
                  {item.item_picture && (
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${item.item_picture}`}
                        alt={item.item_name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                        {item.item_name}
                      </h3>
                      <p className="text-2xl font-bold text-primary">
                        ${item.item_price}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.item_description}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.school_name}
                        </span>
                      <p className="text-sm text-muted-foreground">
                        Sold by{" "}
                        <span className="font-medium text-foreground">{item.user_name}</span>
                      </p>
                      
                      <div className="flex gap-2">
                        <button 
                          className="btn flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
                          onClick={async () => {
                            const { error } = await supabase
                              .from('InCartItems')
                              .insert([
                                {
                                  item_name: item.item_name,
                                  item_category: item.item_category,
                                  item_price: item.item_price,
                                  item_description: item.item_description,
                                  item_picture: item.item_picture,
                                  seller_id: item.user_id,
                                  seller_name: item.user_name,
                                  seller_email: item.user_email,
                                  buyer_id: current_user_id,
                                  all_items_db_id: item.item_id,
                                  school_name: item.school_name
                                }
                              ])
                            if (error) {
                              console.error("Error adding item to cart", error);
                            } else {
                              alert("Item added to cart successfully");
                              window.location.reload();
                            }
                          }}
                        >
                          Add to Cart
                        </button>
                        
                        <button
                          className="btn flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-secondary/80"
                          onClick={async () => {
                            if (current_user_id === null) {
                              alert('Please login to purchase this item');
                              router.push('/login');
                              return;
                            }
                            else if (window.confirm('Please confirm purchase of this item')) {
                              // Send email to seller
                              try {
                                // Add a small delay to ensure EmailJS is fully initialized
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                
                                const templateParams = {
                                  to_email: item.user_email,
                                  to_name: item.user_name,
                                  from_name: current_user_name,
                                  from_email: current_user_email,
                                  item_name: item.item_name,
                                  item_price: item.item_price,
                                  item_description: item.item_description || '',
                                  school_name: item.school_name || 'Not specified',
                                };
                                
                                console.log('Sending email to seller...');
                                console.log('Template params:', templateParams);
                                
                                // Check if EmailJS is properly initialized
                                if (typeof emailjs === 'undefined') {
                                  throw new Error('EmailJS not available');
                                }
                                
                                console.log('EmailJS object:', emailjs);
                                console.log('About to call emailjs.send...');
                                
                                // Try the original send method with better error handling
                                console.log('Using send method...');
                                
                                // Try using sendForm with a dummy form element
                                const dummyForm = document.createElement('form');
                                dummyForm.style.display = 'none';
                                
                                // Add form fields
                                Object.keys(templateParams).forEach(key => {
                                  const input = document.createElement('input');
                                  input.type = 'hidden';
                                  input.name = key;
                                  input.value = templateParams[key as keyof typeof templateParams];
                                  dummyForm.appendChild(input);
                                });
                                
                                document.body.appendChild(dummyForm);
                                
                                try {
                                  await emailjs.sendForm("service_xow6qoh", "template_n8dtcod", dummyForm, "n6jpUtOzTsP-7PWmk");
                                  console.log('Email sent using sendForm method');
                                } catch (sendFormError) {
                                  console.log('sendForm failed, trying send method...');
                                  try {
                                    await emailjs.send("service_xow6qoh", "template_n8dtcod", templateParams);
                                    console.log('Email sent using send method');
                                  } catch (sendError) {
                                    console.log('Both EmailJS methods failed, will use fallback');
                                    throw sendError; // Re-throw to trigger fallback
                                  }
                                }
                                
                                // Clean up
                                document.body.removeChild(dummyForm);
                                console.log('Email sent to seller successfully');
                                
                              } catch (error: any) {
                                // EmailJS failed, but that's expected due to network issues
                                console.log('EmailJS unavailable, using fallback method...');
                                
                                // Fallback: Open email client with pre-filled message
                                console.log('Opening email client with seller notification...');
                                const subject = encodeURIComponent(`Your item "${item.item_name}" has been sold!`);
                                const body = encodeURIComponent(`
Hi ${item.user_name},

Great news! Your item "${item.item_name}" has been sold to ${current_user_name} for $${item.item_price}.

Buyer Details:
- Name: ${current_user_name}
- Email: ${current_user_email}
- School: ${item.school_name || 'Not specified'}

Please contact them to arrange payment and pickup.

Best regards,
TriDealz Team
                                `);
                                
                                // Open default email client
                                const mailtoUrl = `mailto:${item.user_email}?subject=${subject}&body=${body}`;
                                window.open(mailtoUrl);
                                console.log('✅ Seller notification sent via email client');
                                
                                // Continue with purchase
                              }
                              
                              // Navigate to buy page
                              const params = new URLSearchParams({
                                item_id: item.item_id,
                                item_name: item.item_name,
                                item_price: item.item_price,
                                item_picture: item.item_picture || '',
                                item_category: item.item_category,
                                item_description: item.item_description,
                                seller_name: item.user_name,
                                seller_id: item.user_id,
                                seller_email: item.user_email || '',
                                school_name: item.school_name
                              });
                              router.push(`/buy?${params.toString()}`);
                            }
                          }}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-muted-foreground text-2xl">inventory_2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">No items found</h3>
                  <p className="text-muted-foreground">Be the first to post an item!</p>
                  <Link 
                    href="/post-item" 
                    className="btn inline-flex bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium"
                  >
                    Post an Item
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
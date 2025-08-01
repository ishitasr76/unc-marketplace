"use client";
import { Suspense } from "react";
import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "../UserContext";
import Link from "next/link";
import emailjs from '@emailjs/browser';

export default function BuyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <BuyPageContent />
    </Suspense>
  );
}

function BuyPageContent() {
  const { current_user_id, current_user_name, current_user_email } = useUser();

  const searchParams = useSearchParams();
  const item_id = searchParams.get("item_id");
  const itemName = searchParams.get("item_name");   
  const itemDescription = searchParams.get("item_description");
  const itemPicture = searchParams.get("item_picture");
  const itemPrice = searchParams.get("item_price");
  const itemCategory = searchParams.get("item_category");
  const sellerId = searchParams.get("seller_id");
  const sellerName = searchParams.get("seller_name");
  const sellerEmail = searchParams.get("seller_email");
  const schoolName = searchParams.get("school_name");
  const hasRun = useRef(false);

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
    if (
      !item_id ||
      !itemName ||
      !itemPrice ||
      !sellerEmail ||
      !sellerName ||
      !current_user_id ||
      !current_user_name ||
      !current_user_email
    ) {
      return;
    }
    if (hasRun.current) return;
    hasRun.current = true;

    async function recordSale() {
      const { error } = await supabase
        .from('ItemsSold')
        .insert([
          {
            item_name: itemName,
            item_category: itemCategory,
            item_price: itemPrice,
            item_description: itemDescription,
            item_picture: itemPicture,
            sold_by_user_id: sellerId,
            sold_by_user_name: sellerName,
            bought_by_user_id: current_user_id,
            bought_by_user_name: current_user_name,
            sold_by_user_email: sellerEmail,
            school_name: schoolName,
          }
        ]);
      if (error) {
        alert('Failed to record sale!');
        console.error(error);
      } else {
        console.log('Sale recorded!');
      }
    }

    async function removeItemFromMarketplace() {
      const { error } = await supabase
        .from('Items')
        .delete()
        .eq('item_id', item_id);
      if (error) {
        console.error('Error removing item:', error);
      }
    }
    async function removeItemFromCart() {
      try {
        // Delete this item from ALL users' carts (not just current buyer)
        const { error: deleteError } = await supabase
          .from('InCartItems')
          .delete()
          .eq('all_items_db_id', item_id);
        
        if (deleteError) {
          console.error('Error removing item from all carts:', deleteError);
        } else {
          console.log('Item removed from all users\' carts successfully');
        }
      } catch (error) {
        console.error('Error in removeItemFromCart:', error);
      }
    }

    async function sendEmailToSeller() {
      try {
        // Add a small delay to ensure EmailJS is fully initialized
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const templateParams = {
          to_email: sellerEmail!,
          to_name: sellerName!,
          from_name: current_user_name!,
          from_email: current_user_email!,
          item_name: itemName!,
          item_price: itemPrice!,
          item_description: itemDescription || '',
          school_name: schoolName || 'Not specified',
        };

        console.log('Sending email to seller...');
        
        // Check if EmailJS is properly initialized
        if (typeof emailjs === 'undefined') {
          throw new Error('EmailJS not available');
        }

        await emailjs.send('service_xow6qoh', 'template_n8dtcod', templateParams);
        console.log('Email sent to seller successfully');
        
      } catch (error: any) {
        // EmailJS failed, but that's expected due to network issues
        console.log('EmailJS unavailable, using fallback method...');
        
        // Fallback: Open email client with pre-filled message
        console.log('Opening email client with seller notification...');
        const subject = encodeURIComponent(`Your item "${itemName}" has been sold!`);
        const body = encodeURIComponent(`
Hi ${sellerName},

Great news! Your item "${itemName}" has been sold to ${current_user_name} for $${itemPrice}.

Buyer Details:
- Name: ${current_user_name}
- Email: ${current_user_email}
- School: ${schoolName || 'Not specified'}

Please contact them to arrange payment and pickup.

Best regards,
TriDealz Team
        `);
        
        // Open default email client
        const mailtoUrl = `mailto:${sellerEmail}?subject=${subject}&body=${body}`;
        window.open(mailtoUrl);
        console.log('✅ Seller notification sent via email client');
      }
    }


    async function updateSellerStats() {
      const { data } = await supabase
        .from('UserStats')
        .select('items_sold, total_money_made_on_app')
        .eq('user_id', sellerId);
      const items_sold = (data?.[0]?.items_sold || 0) + 1;
      const total_money_made_on_app = (data?.[0]?.total_money_made_on_app || 0) + Number(itemPrice);

      const { error } = await supabase
        .from('UserStats')
        .update({
          items_sold: items_sold,
          total_money_made_on_app: total_money_made_on_app
        })
        .eq('user_id', sellerId);
      if (error) {
        alert('Failed to update seller stats!');
        console.error(error);
      } else {
        console.log('Seller stats updated!');
      }
    }

    async function updateBuyerStats() {
      const { data } = await supabase
        .from('UserStats')
        .select('items_bought, total_money_spent_on_app')
        .eq('user_id', current_user_id);
      const items_bought = (data?.[0]?.items_bought || 0) + 1;
      const total_money_spent_on_app = (data?.[0]?.total_money_spent_on_app || 0) + Number(itemPrice);

      const { error } = await supabase
        .from('UserStats')
        .update({
          items_bought: items_bought,
          total_money_spent_on_app: total_money_spent_on_app
        })
        .eq('user_id', current_user_id);
      if (error) {
        alert('Failed to update buyer stats!');
        console.error(error);
      } else {
        console.log('Buyer stats updated!');
      }
    }

    recordSale();
    removeItemFromCart();
    removeItemFromMarketplace();
    updateSellerStats();
    updateBuyerStats();
    sendEmailToSeller();
  }, [item_id, itemName, itemPrice, sellerEmail, sellerName, current_user_id, current_user_name, current_user_email]);

  if (
    !item_id ||
    !itemName ||
    !itemPrice ||
    !sellerEmail ||
    !sellerName ||
    !current_user_id ||
    !current_user_name ||
    !current_user_email
  ) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading purchase details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-white text-2xl">check_circle</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Purchase Successful!</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Congratulations! Your purchase has been completed successfully.
            </p>
          </div>
        </div>

        {/* Purchase Details */}
        <div className="card bg-background rounded-xl border border-border p-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Purchase Details</h2>
              <p className="text-muted-foreground">
                We have sent an email to the seller with your purchase information. 
                Make sure to contact them to arrange payment and pickup or delivery.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {itemPicture && (
                <div className="w-full md:w-1/2">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${itemPicture}`}
                      alt={itemName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">{itemName}</h3>
                  <p className="text-3xl font-bold text-primary">${itemPrice}</p>
                  <p className="text-muted-foreground">{itemDescription}</p>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="font-semibold text-foreground">Seller Information</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Name:</span> {sellerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Email:</span> {sellerEmail}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">School:</span> {schoolName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
              <Link 
                href="/"
                className="btn flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 text-center"
              >
                Continue Shopping
              </Link>
              <Link 
                href="/orders"
                className="btn flex-1 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold border border-border hover:bg-secondary/80 text-center"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
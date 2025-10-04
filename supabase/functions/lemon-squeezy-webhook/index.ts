import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey, X-Signature',
};

interface LemonSqueezyWebhookEvent {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
      business_id?: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      subscription_id?: number;
      customer_id?: number;
      order_id?: number;
      product_id?: number;
      variant_id?: number;
      status?: string;
      renews_at?: string;
      ends_at?: string;
      trial_ends_at?: string;
      cancels_at?: string;
      created_at?: string;
      updated_at?: string;
      user_email?: string;
    };
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Verify webhook signature
    const signature = req.headers.get('X-Signature');
    const secret = Deno.env.get('LEMON_SQUEEZY_WEBHOOK_SECRET');

    if (!secret) {
      console.error('LEMON_SQUEEZY_WEBHOOK_SECRET not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook secret not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get request body
    const rawBody = await req.text();
    const payload: LemonSqueezyWebhookEvent = JSON.parse(rawBody);

    // Verify signature using crypto.subtle
    if (signature) {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      );

      const signatureBuffer = Uint8Array.from(
        signature.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
      );

      const isValid = await crypto.subtle.verify(
        'HMAC',
        key,
        signatureBuffer,
        encoder.encode(rawBody)
      );

      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    console.log('Webhook event received:', payload.meta.event_name);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data || {};
    const attributes = payload.data.attributes;

    // Extract user_id and business_id from custom_data or look up by email
    let userId = customData.user_id;
    let businessId = customData.business_id;
    const userEmail = attributes.user_email;

    // If no custom_data, try to find user by email
    if ((!userId || !businessId) && userEmail) {
      console.log('Looking up user by email:', userEmail);

      // First, get the user by email from auth.users
      const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        console.error('Error fetching auth users:', authError);
        return new Response(
          JSON.stringify({ error: 'Error looking up user' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const user = authUser.users.find(u => u.email === userEmail);

      if (!user) {
        console.error('User not found with email:', userEmail);
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      userId = user.id;

      // Now get the business_id for this user
      const { data: businessProfile, error: businessError } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (businessError) {
        console.error('Error fetching business profile:', businessError);
        return new Response(
          JSON.stringify({ error: 'Error looking up business' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (!businessProfile) {
        console.error('Business profile not found for user:', userId);
        return new Response(
          JSON.stringify({ error: 'Business profile not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      businessId = businessProfile.id;
      console.log('Found user_id:', userId, 'business_id:', businessId);
    }

    if (!userId || !businessId) {
      console.error('Missing user_id or business_id');
      return new Response(
        JSON.stringify({ error: 'Missing user_id or business_id' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Map product_id to plan name
    const productIdToPlan: Record<string, string> = {
      '652469': 'basico',
      '652470': 'profesional',
      '652471': 'empresarial',
    };

    const planName = attributes.product_id
      ? productIdToPlan[attributes.product_id.toString()]
      : null;

    if (!planName) {
      console.error('Unknown product_id:', attributes.product_id);
      return new Response(
        JSON.stringify({ error: 'Unknown product' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Handle different webhook events
    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated': {
        // Upsert subscription
        const { error } = await supabase
          .from('subscriptions')
          .upsert(
            {
              user_id: userId,
              business_id: businessId,
              user_email: userEmail,
              lemon_squeezy_subscription_id: attributes.subscription_id?.toString() || payload.data.id,
              lemon_squeezy_customer_id: attributes.customer_id?.toString(),
              lemon_squeezy_order_id: attributes.order_id?.toString(),
              lemon_squeezy_product_id: attributes.product_id?.toString(),
              lemon_squeezy_variant_id: attributes.variant_id?.toString(),
              plan_name: planName,
              status: attributes.status || 'active',
              current_period_start: attributes.created_at,
              current_period_end: attributes.renews_at || attributes.ends_at,
              cancel_at_period_end: !!attributes.cancels_at,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'lemon_squeezy_subscription_id' }
          );

        if (error) {
          console.error('Error upserting subscription:', error);
          throw error;
        }

        console.log('Subscription upserted successfully');
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        // Update subscription status
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: eventName === 'subscription_cancelled' ? 'cancelled' : 'expired',
            cancel_at_period_end: true,
            updated_at: new Date().toISOString(),
          })
          .eq('lemon_squeezy_subscription_id', attributes.subscription_id?.toString() || payload.data.id);

        if (error) {
          console.error('Error updating subscription:', error);
          throw error;
        }

        console.log('Subscription updated to', eventName);
        break;
      }

      case 'subscription_resumed': {
        // Resume subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          })
          .eq('lemon_squeezy_subscription_id', attributes.subscription_id?.toString() || payload.data.id);

        if (error) {
          console.error('Error resuming subscription:', error);
          throw error;
        }

        console.log('Subscription resumed');
        break;
      }

      case 'subscription_payment_failed': {
        // Mark as past_due
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('lemon_squeezy_subscription_id', attributes.subscription_id?.toString() || payload.data.id);

        if (error) {
          console.error('Error updating subscription to past_due:', error);
          throw error;
        }

        console.log('Subscription marked as past_due');
        break;
      }

      default:
        console.log('Unhandled event:', eventName);
    }

    return new Response(
      JSON.stringify({ success: true, event: eventName }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

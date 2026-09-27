/**
 * Hands a paid order to Shippo as an Order, so it appears in
 * apps.goshippo.com → Orders ready to buy a label. No label is bought here:
 * the parcel size, service and sender address are chosen in Shippo (its
 * default sender address and parcel templates apply), so nothing is spent
 * automatically.
 *
 * Needs SHIPPO_API_KEY in the Netlify environment; without it this is a no-op.
 */
const API = 'https://api.goshippo.com/orders/';

/** Stripe moved the shipping address under collected_information in newer API versions. */
export function shippingFrom(session) {
  const s = session.collected_information?.shipping_details ?? session.shipping_details ?? null;
  const address = s?.address ?? session.customer_details?.address ?? null;
  return address ? { name: s?.name ?? session.customer_details?.name ?? null, address } : null;
}

/**
 * @param {object} session  paid Stripe Checkout Session
 * @param {{ title: string, sku?: string|null, quantity?: number }} item
 * @returns {Promise<string|null>} the Shippo order object_id, or null if skipped/failed
 */
export async function createShippoOrder(session, item) {
  const key = process.env.SHIPPO_API_KEY;
  if (!key) return null;
  const ship = shippingFrom(session);
  if (!ship) {
    console.warn('shippo: session has no shipping address; order not sent', session.id);
    return null;
  }
  const currency = (session.currency || 'usd').toUpperCase();
  const total = ((session.amount_total ?? 0) / 100).toFixed(2);
  const a = ship.address;
  const body = {
    order_number: session.id,
    order_status: 'PAID',
    placed_at: new Date((session.created ?? Date.now() / 1000) * 1000).toISOString(),
    to_address: {
      name: ship.name || session.customer_details?.name || 'Customer',
      street1: a.line1,
      street2: a.line2 || '',
      city: a.city,
      state: a.state || '',
      zip: a.postal_code || '',
      country: a.country,
      email: session.customer_details?.email || '',
      phone: session.customer_details?.phone || '',
    },
    line_items: [
      {
        title: item.title,
        sku: item.sku || undefined,
        quantity: item.quantity || 1,
        total_price: total,
        currency,
      },
    ],
    total_price: total,
    currency,
  };
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { Authorization: `ShippoToken ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('shippo order failed', res.status, JSON.stringify(data));
      return null;
    }
    console.log('shippo order created', data.object_id, 'for', session.id);
    return data.object_id ?? null;
  } catch (err) {
    console.error('shippo order failed', err);
    return null;
  }
}

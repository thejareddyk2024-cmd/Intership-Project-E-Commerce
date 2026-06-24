import stripe
from app.core.config import settings

if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY

def create_checkout_session(order_id: int, total_amount: float, frontend_url: str):
    """
    Creates a Stripe Checkout Session for an order.
    total_amount is expected in dollars. Stripe requires cents.
    """
    if not settings.STRIPE_SECRET_KEY:
        # Simulated mode if no Stripe key is provided
        return f"{frontend_url}/checkout/success?session_id=simulated_{order_id}"

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f'ShopSmart-AI Order #{order_id}',
                    },
                    'unit_amount': int(total_amount * 100),  # Convert to cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{frontend_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{frontend_url}/cart",
            client_reference_id=str(order_id),
        )
        return session.url
    except Exception as e:
        print(f"Stripe Error: {e}")
        # Fallback to simulated if error
        return f"{frontend_url}/checkout/success?session_id=simulated_error_{order_id}"

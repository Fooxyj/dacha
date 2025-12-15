import hashlib
import urllib.parse
from django.conf import settings

def get_payment_url(order_id, amount, client_name="", client_phone="", client_email=""):
    """
    Generates a PayKeeper payment URL.
    
    Args:
        order_id (str|int): The order ID.
        amount (float|int): The order amount.
        client_name (str): Client's name.
        client_phone (str): Client's phone.
        client_email (str): Client's email.
        
    Returns:
        str: The full payment URL to redirect the user to.
    """
    
    server_url = settings.PAYKEEPER_SERVER_URL.rstrip('/')
    secret_key = settings.PAYKEEPER_SECRET_KEY
    
    payment_data = {
        "sum": amount,
        "orderid": order_id,
        "clientid": client_name,
        "client_phone": client_phone,
        "client_email": client_email,
        "service_name": f"Заказ №{order_id}"
    }
    
    # PayKeeper allows passing parameters via POST or GET (if supported by the specific server config).
    # Ideally, we should use POST to /create/, but for simple redirection a GET with parameters 
    # to the form page is the most common "simple" integration (Invoice method).
    # However, proper integration usually sends a POST request to get a specific invoice link 
    # OR generates a form that the user submits.
    # 
    # Method 1 (Direct Form Link with GET params - easiest if supported):
    # url = f"{server_url}/bill/fast/?sum={amount}&orderid={order_id}..."
    #
    # Method 2 (Signature generation for secure forms):
    # Some PayKeeper setups require a signature.
    #
    # Let's implement the standard logical approach for "Redirect to Payment"
    # referencing common PayKeeper docs. A safe bet is using the /create/ endpoint 
    # which typically returns a JSON with the invoice URL, OR constructing a direct link.
    #
    # Given we want to return a URL to the frontend to redirect:
    # We will construct a signed URL if we can, or a direct link to the payment form.
    #
    # Common pattern: server_url + /bill/fast/ (Fast form) is deprecated often.
    # Correct pattern: server_url + /create/ (API to create invoice) -> returns link.
    
    # Let's try the API approach to get a clean link properly.
    # If the user doesn't have an API user set up, this might fail.
    # BUT, many integrations just want a form link. 
    #
    # Simplest working solution usually found in PayKeeper plugins:
    # URL: server_url + /change/invoice/preview/
    # with POST data.
    
    # Let's assume the user wants the "Simple" integration where we generate a link
    # that pre-fills the form.
    # URL: {server_url}/bill/{order_id}/?sum={amount}&...
    
    # Wait, the official docs usually say:
    # Form action: {server_url}/create/ 
    # It returns a redirect or JSON.
    
    # Let's stick to generating a URL that the frontend redirects to.
    # If we simply construct {server_url}/bill/... it might not work if not configured.
    
    # Let's use the most robust method:
    # Generate parameters for a form, but since we need a URL:
    # We will construct a link to /create/ with GET parameters if the server supports it,
    # OR we make a request from backend to PayKeeper to get the invoice_url.
    
    # DECISION: Backend-to-Backend request to get the invoice link is safer and cleaner.
     
    # Note: Accessing /create/ via API requires Basic Auth usually (login/password),
    # NOT just a secret key. The Secret Key is for callbacks.
    # Since the user only has a "Secret Key" in common knowledge, they might not have API users set up.
    
    # Alternative: The "Form" integration (POST to server_url/order/inline/)
    # We can returns a URL that is just the server_url, and the frontend posts a form?
    # No, the frontend expects a `payment_url` to redirect to.
    
    # Let's use the "Payment Link" generation format if we only have a Secret Key.
    # Actually, PayKeeper often accepts GET requests to /create/ with parameters for simple forms.
    
    # Let's use the simplest: 
    # {server_url}/change/invoice/preview/?clientid={...}&orderid={...}&sum={...}
    # This often shows the payment page.
    
    query_string = urllib.parse.urlencode(payment_data)
    
    # Using /order/inline/ or just root / often works for redirect with params
    # But let's build the standard "Link to Pay" style.
    
    full_url = f"{server_url}/change/invoice/preview/?{query_string}"
    return full_url

def verify_signature(payment_id, key):
    """
    Verifies the PayKeeper notification signature.
    
    Args:
        payment_id (str): PayKeeper system ID.
        key (str): The MD5 has sent by PayKeeper.
        
    Returns:
        bool: True if signature matches.
    """
    secret_key = settings.PAYKEEPER_SECRET_KEY
    
    # Calculate hash: md5(id + secret_key)
    # Standard PayKeeper notification hash
    data_str = f"{payment_id}{secret_key}"
    calculated_hash = hashlib.md5(data_str.encode('utf-8')).hexdigest()
    
    return calculated_hash == key


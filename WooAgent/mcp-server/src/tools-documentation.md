# WooCommerce MCP Server Tools Documentation

This document provides information about the tools available in the TechSpawn WooCommerce MCP Server.

## Product Tools

### list_products
Lists products from the WooCommerce store.

**Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Number of products per page (default: 10)
- `search` (optional): Search term to filter products
- `category` (optional): Category ID to filter products
- `status` (optional): Product status (publish, draft, etc.)

**Returns:**
Array of product objects with details like ID, name, price, etc.

### get_product
Gets a single product by ID.

**Parameters:**
- `id` (required): Product ID

**Returns:**
Product object with all details.

### create_product
Creates a new product.

**Parameters:**
- `name` (required): Product name
- `type` (optional): Product type (simple, variable, etc.)
- `regular_price` (optional): Regular price
- `description` (optional): Product description
- `short_description` (optional): Product short description
- `categories` (optional): Array of category IDs
- `images` (optional): Array of image URLs
- `attributes` (optional): Array of attribute objects

**Returns:**
Created product object.

### update_product
Updates an existing product.

**Parameters:**
- `id` (required): Product ID
- `name` (optional): Product name
- `regular_price` (optional): Regular price
- `description` (optional): Product description
- `short_description` (optional): Product short description
- `categories` (optional): Array of category IDs
- `images` (optional): Array of image URLs
- `attributes` (optional): Array of attribute objects

**Returns:**
Updated product object.

### delete_product
Deletes a product.

**Parameters:**
- `id` (required): Product ID
- `force` (optional): Whether to permanently delete (default: false)

**Returns:**
Deleted product object.

## Order Tools

### list_orders
Lists orders from the WooCommerce store.

**Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Number of orders per page (default: 10)
- `status` (optional): Order status (processing, completed, etc.)
- `customer` (optional): Customer ID

**Returns:**
Array of order objects.

### get_order
Gets a single order by ID.

**Parameters:**
- `id` (required): Order ID

**Returns:**
Order object with all details.

### create_order
Creates a new order.

**Parameters:**
- `customer_id` (optional): Customer ID
- `payment_method` (optional): Payment method
- `payment_method_title` (optional): Payment method title
- `set_paid` (optional): Whether to set the order as paid
- `billing` (optional): Billing address object
- `shipping` (optional): Shipping address object
- `line_items` (optional): Array of line item objects
- `shipping_lines` (optional): Array of shipping line objects

**Returns:**
Created order object.

### update_order
Updates an existing order.

**Parameters:**
- `id` (required): Order ID
- `status` (optional): Order status

**Returns:**
Updated order object.

## Customer Tools

### list_customers
Lists customers from the WooCommerce store.

**Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Number of customers per page (default: 10)
- `search` (optional): Search term to filter customers
- `email` (optional): Email to filter customers

**Returns:**
Array of customer objects.

### get_customer
Gets a single customer by ID.

**Parameters:**
- `id` (required): Customer ID

**Returns:**
Customer object with all details.

### create_customer
Creates a new customer.

**Parameters:**
- `email` (required): Customer email
- `first_name` (optional): Customer first name
- `last_name` (optional): Customer last name
- `username` (optional): Customer username
- `password` (optional): Customer password
- `billing` (optional): Billing address object
- `shipping` (optional): Shipping address object

**Returns:**
Created customer object.

### update_customer
Updates an existing customer.

**Parameters:**
- `id` (required): Customer ID
- `email` (optional): Customer email
- `first_name` (optional): Customer first name
- `last_name` (optional): Customer last name
- `billing` (optional): Billing address object
- `shipping` (optional): Shipping address object

**Returns:**
Updated customer object.

## Coupon Tools

### list_coupons
Lists coupons from the WooCommerce store.

**Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Number of coupons per page (default: 10)
- `code` (optional): Coupon code to filter

**Returns:**
Array of coupon objects.

### get_coupon
Gets a single coupon by ID.

**Parameters:**
- `id` (required): Coupon ID

**Returns:**
Coupon object with all details.

### create_coupon
Creates a new coupon.

**Parameters:**
- `code` (required): Coupon code
- `discount_type` (required): Discount type (percent, fixed_cart, fixed_product)
- `amount` (required): Coupon amount
- `individual_use` (optional): Whether coupon is for individual use only
- `exclude_sale_items` (optional): Whether to exclude sale items
- `minimum_amount` (optional): Minimum order amount
- `maximum_amount` (optional): Maximum order amount
- `product_ids` (optional): Array of product IDs the coupon applies to
- `excluded_product_ids` (optional): Array of product IDs the coupon does not apply to
- `usage_limit` (optional): Usage limit per coupon
- `usage_limit_per_user` (optional): Usage limit per user
- `expiry_date` (optional): Coupon expiry date

**Returns:**
Created coupon object.

### update_coupon
Updates an existing coupon.

**Parameters:**
- `id` (required): Coupon ID
- `code` (optional): Coupon code
- `discount_type` (optional): Discount type
- `amount` (optional): Coupon amount
- `individual_use` (optional): Whether coupon is for individual use only
- `exclude_sale_items` (optional): Whether to exclude sale items
- `minimum_amount` (optional): Minimum order amount
- `maximum_amount` (optional): Maximum order amount
- `product_ids` (optional): Array of product IDs the coupon applies to
- `excluded_product_ids` (optional): Array of product IDs the coupon does not apply to
- `usage_limit` (optional): Usage limit per coupon
- `usage_limit_per_user` (optional): Usage limit per user
- `expiry_date` (optional): Coupon expiry date

**Returns:**
Updated coupon object.

### delete_coupon
Deletes a coupon.

**Parameters:**
- `id` (required): Coupon ID
- `force` (optional): Whether to permanently delete (default: false)

**Returns:**
Deleted coupon object.

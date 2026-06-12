# API Specification
This document specifies the API endpoints and communication protocols for ShopSmart-AI.
# ShopSmart AI API Specification

# Base URL

/api/v1

---

# Authentication APIs

## Register User

POST

/auth/register

Request:

{
"full_name": "John Doe",
"email": "[john@example.com](mailto:john@example.com)",
"password": "password123"
}

Response:

{
"message": "User registered successfully"
}

---

## Login

POST

/auth/login

Request:

{
"email": "[john@example.com](mailto:john@example.com)",
"password": "password123"
}

Response:

{
"access_token": "jwt_token",
"token_type": "bearer"
}

---

## Get Current User

GET

/auth/me

Response:

{
"id": 1,
"name": "John Doe",
"email": "[john@example.com](mailto:john@example.com)"
}

---

# Categories APIs

## Get Categories

GET

/categories

---

## Create Category

POST

/categories

Admin Only

---

# Products APIs

## Get Products

GET

/products

Query Parameters:

* page
* limit
* category
* brand
* min_price
* max_price

---

## Get Product By ID

GET

/products/{product_id}

---

## Create Product

POST

/products

Admin Only

---

## Update Product

PUT

/products/{product_id}

Admin Only

---

## Delete Product

DELETE

/products/{product_id}

Admin Only

---

## Product Search

GET

/products/search

Query:

?q=laptop

---

# Wishlist APIs

## Add To Wishlist

POST

/wishlist

---

## Remove From Wishlist

DELETE

/wishlist/{product_id}

---

## View Wishlist

GET

/wishlist

---

# Cart APIs

## Get Cart

GET

/cart

---

## Add To Cart

POST

/cart

Request:

{
"product_id": 1,
"quantity": 2
}

---

## Update Cart Item

PUT

/cart/{item_id}

---

## Remove Cart Item

DELETE

/cart/{item_id}

---

# Order APIs

## Checkout

POST

/orders/checkout

---

## Create Order

POST

/orders

---

## Get Orders

GET

/orders

---

## Get Order Details

GET

/orders/{order_id}

---

# Reviews APIs

## Create Review

POST

/reviews

---

## Update Review

PUT

/reviews/{review_id}

---

## Delete Review

DELETE

/reviews/{review_id}

---

## Get Product Reviews

GET

/products/{product_id}/reviews

---

# AI APIs

## AI Shopping Assistant

POST

/ai/chat

Request:

{
"message": "Best laptop under 70000"
}

Response:

{
"answer": "..."
}

---

## Product Recommendation

POST

/ai/recommend

Request:

{
"budget": 70000,
"category": "laptop"
}

---

## Product Comparison

POST

/ai/compare

Request:

{
"products": [1, 2, 3]
}

---

## AI Product Summary

GET

/ai/product-summary/{product_id}

---

# RAG APIs

## Ask Product Question

POST

/rag/query

Request:

{
"question": "Does this laptop support DDR5 RAM?"
}

---

## Upload Knowledge Base Document

POST

/rag/upload

Admin Only

---

# Analytics APIs

## Dashboard Metrics

GET

/admin/analytics

Admin Only

Response:

{
"total_users": 0,
"total_orders": 0,
"total_revenue": 0
}

---

## Top Selling Products

GET

/admin/top-products

Admin Only

---

## User Activity Logs

GET

/admin/activity

Admin Only

---

# Future APIs

/payment

/coupons

/notifications

/vendors

/shipments

# Architecture
This document describes the high-level architecture of ShopSmart-AI.
# ShopSmart AI Architecture Specification

# System Overview

ShopSmart AI follows a modular service-oriented architecture.

The application is divided into:

1. Frontend Application
2. Backend API Service
3. AI Recommendation Service
4. RAG Service
5. PostgreSQL Database
6. ChromaDB Vector Database

---

# High Level Architecture

Frontend (React)
|
v
Backend API (FastAPI)
|
+----------------------+
|                      |
v                      v
PostgreSQL             AI Service
|
LangChain + Ollama
|
LangGraph Agent
|
ChromaDB

---

# Service Breakdown

## Frontend Service

Technology:

* React
* TailwindCSS
* Axios
* React Router

Responsibilities:

* User Interface
* Authentication
* Product Display
* Cart Management
* Wishlist Management
* AI Chat Interface
* Admin Dashboard

Folder Structure:

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── routes/
│   └── utils/

---

## Backend API Service

Technology:

* FastAPI
* SQLAlchemy
* PostgreSQL
* JWT

Responsibilities:

* Authentication
* Product Management
* Cart Management
* Orders
* Reviews
* Wishlist
* Admin Operations

Folder Structure:

backend/
├── app/
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── database/
│   ├── core/
│   └── utils/

---

## AI Service

Technology:

* LangChain
* LangGraph
* Ollama

Responsibilities:

* Recommendations
* Product Comparison
* Shopping Assistant
* Review Summarization

Folder Structure:

ai-service/
├── agents/
├── prompts/
├── chains/
├── tools/
├── models/

---

## RAG Service

Technology:

* LangChain
* ChromaDB

Responsibilities:

* Product Manual Search
* FAQ Search
* Knowledge Retrieval

Folder Structure:

rag-service/
├── ingestion/
├── vectorstore/
├── retrieval/
├── embeddings/

---

# API Communication

Frontend
→ Backend API

Backend
→ PostgreSQL

Backend
→ AI Service

Backend
→ RAG Service

AI Service
→ Ollama

RAG Service
→ ChromaDB

---

# Authentication Flow

User Login
→ Backend

Backend Validates Credentials
→ PostgreSQL

Backend Generates JWT

JWT Returned To Frontend

Frontend Stores Token

Protected Routes Require JWT

---

# Product Search Flow

User Searches Product

Frontend
→ Backend

Backend
→ PostgreSQL

Results Returned To Frontend

---

# AI Recommendation Flow

User Asks:

"Best laptop under ₹70,000"

Frontend
→ Backend

Backend
→ AI Service

AI Service
→ LangGraph

LangGraph
→ Product Search Tool

LangGraph
→ Recommendation Tool

Response Returned

---

# Product Comparison Flow

User Selects Products

Frontend
→ Backend

Backend
→ AI Service

AI Service
→ LangGraph

LangGraph Generates:

* Comparison
* Strengths
* Weaknesses
* Recommendation

---

# RAG Flow

User Asks:

"Does this laptop support DDR5 RAM?"

Frontend
→ Backend

Backend
→ RAG Service

RAG Service
→ ChromaDB

Relevant Documents Retrieved

Answer Generated

Response Returned

---

# Database Architecture

Main Database:

PostgreSQL

Tables:

* users
* products
* categories
* carts
* cart_items
* orders
* order_items
* reviews
* wishlists

---

# Vector Database

Technology:

ChromaDB

Collections:

* product_manuals
* product_faqs
* warranty_documents

---

# Scalability Design

Future Support:

* AWS Deployment
* Multiple AI Models
* Marketplace Vendors
* Payment Gateway
* Mobile App

---

# Development Order

Phase 1

Authentication
Products
Categories

Phase 2

Cart
Wishlist
Orders

Phase 3

Reviews
Admin Dashboard

Phase 4

AI Assistant
Recommendations

Phase 5

RAG

Phase 6

Deployment

---

# Coding Standards

Backend:

* Service Layer Pattern
* Dependency Injection
* Pydantic Validation

Frontend:

* Reusable Components
* Context API
* Clean Folder Structure

AI:

* Modular Prompts
* Reusable Chains
* Reusable Agents

# Mailra Website - Functional Description

## Overview
A simple, streamlined website for Mailra - a Dutch event rental business offering chairs, tables, and other event products.

## Site Structure

### 1. Home Page
**Purpose:** Create immediate impact and drive visitors to explore products

**Key Elements:**
- Hero section with compelling headline about event rentals
- Brief value proposition (2-3 sentences)
- High-quality image showcasing a styled event setup
- Clear call-to-action button leading to products
- Trust indicators (years of experience, number of events served)
- Quick preview of product categories with images
- Contact section at bottom with:
  - Phone number
  - Email address
  - WhatsApp button
  - Simple contact form (name, email, message)

**Goal:** Make visitors immediately understand what Mailra offers and encourage them to browse products or reach out directly.

### 2. Products Page
**Purpose:** Display all rental items organized by category

**Structure:**
- Category navigation/filter (Stoelen, Tafels, Decoratie, etc.)
- Product grid layout with:
  - Product image
  - Product name
  - Key details (dimensions, capacity)
  - Contact button for pricing/availability

**Categories to include:**
- Chairs (Stoelen)
- Tables (Tafels)
- Decoration items (Decoratie)
- Additional categories as needed

**Note:** Keep product entry simple - just image, name, and basic specs. No complex inventory management.

### 3. About Page
**Purpose:** Build trust and explain Mailra's service

**Content:**
- Who Mailra is
- Service area (which regions in Netherlands)
- How the rental process works (simple steps)
- Contact information
- Optional: photo of Mailra/team

### 4. Contact Page
**Purpose:** Make it easy for potential clients to reach Mailra

**Content:**
- Contact form (name, email, phone, event date, message)
- Direct contact details:
  - Phone number (clickable for mobile)
  - Email address
  - WhatsApp button
- Business hours
- Service area information
- Optional: embedded map if there's a physical location

## Technical Approach
- Next.js for performance and SEO
- Mobile-responsive design
- Fast loading images
- Simple content management (easy for Mailra to update)
- Contact form or WhatsApp integration for inquiries

## Content Management Strategy
Keep it minimal to avoid overwhelming Mailra:
- Products stored in simple JSON/markdown files or a basic CMS
- Each product needs: 1 photo, name, basic description, dimensions
- No pricing displayed (handled via contact/quote)

## Design Philosophy
Clean, professional, and easy to navigate. Focus on visual appeal with quality photography showing products in use at events.
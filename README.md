# E-commerce Dashboard with Glow UI

This is a modern, full-stack e-commerce application featuring a sleek "glow" UI design. It includes a customer-facing storefront and an admin dashboard for managing products and categories.

## About The Project

This project is a feature-rich e-commerce platform built with a modern tech stack. It provides a seamless shopping experience for users and a powerful dashboard for administrators.

### Key Features:

*   **Modern UI/UX:** A beautiful and intuitive user interface with a unique "glow" effect, built with React, shadcn-ui, and Tailwind CSS.
*   **Full-stack Solution:** Powered by React on the frontend and Supabase for the backend, providing a robust and scalable architecture.
*   **User Authentication:** Secure user registration and login functionality with Supabase Auth.
*   **Product Catalog:** A comprehensive product catalog with categories, search, and filtering.
*   **Shopping Cart:** A fully functional shopping cart with the ability to add, remove, and update items.
*   **Admin Dashboard:** A protected admin dashboard for managing products, categories, and orders.

## Tech Stack

*   [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
*   [Vite](https://vitejs.dev/) - A fast build tool and development server for modern web projects.
*   [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript that compiles to plain JavaScript.
*   [Supabase](https://supabase.io/) - The open source Firebase alternative for building secure and scalable backends.
*   [shadcn-ui](https://ui.shadcn.com/) - A collection of re-usable components for building React applications.
*   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.

## Project Structure

```
.
├── .env
├── .env.example
├── .gitignore
├── README.md
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── admin
│   │   │   ├── CategoryForm.tsx
│   │   │   └── ProductForm.tsx
│   │   ├── cart
│   │   │   └── CartSidebar.tsx
│   │   ├── layout
│   │   │   └── Header.tsx
│   │   ├── products
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductModal.tsx
│   │   └── ui
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── ... (and 47 more)
│   ├── context
│   │   └── AppContext.tsx
│   ├── data
│   │   └── mockData.ts
│   ├── hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── pages
│   │   ├── Admin.tsx
│   │   ├── Cart.tsx
│   │   ├── Catalog.tsx
│   │   ├── Checkout.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── OrderConfirmation.tsx
│   │   ├── OrderHistory.tsx
│   │   ├── Profile.tsx
│   │   └── SignUp.tsx
│   ├── types
│   │   └── index.ts
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm (or yarn/pnpm)
*   A free Supabase account

### Installation

1.  Clone the repo
    ```sh
    git clone <YOUR_GIT_URL>
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Set up your environment variables. Copy the `.env.example` file to a new file named `.env` and add your Supabase URL and Anon Key.
    ```sh
    cp .env.example .env
    ```
    Then, update the `.env` file with your credentials.

### Supabase Setup

1.  Create a new project in [Supabase](https://app.supabase.io).
2.  Navigate to the "SQL Editor" in your Supabase project.
3.  Run the following SQL script to create the necessary tables and policies.

    ```sql
    -- CATEGORIES
    CREATE TABLE categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );

    -- PRODUCTS
    CREATE TABLE products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      price NUMERIC NOT NULL,
      "imageUrl" TEXT,
      category TEXT NOT NULL REFERENCES categories(name),
      stock INT NOT NULL,
      featured BOOLEAN DEFAULT FALSE
    );

    -- PROFILES (links to auth.users)
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      name TEXT,
      "isAdmin" BOOLEAN DEFAULT FALSE
    );

    -- ORDERS
    CREATE TABLE orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id),
      total NUMERIC NOT NULL,
      customer_info JSONB,
      order_date TIMESTAMPTZ DEFAULT now(),
      status TEXT DEFAULT 'pending'
    );

    -- ORDER_ITEMS
    CREATE TABLE order_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
      product_id UUID REFERENCES products(id),
      quantity INT NOT NULL
    );

    -- ENABLE RLS
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
    ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

    -- TRIGGER TO AUTO-CREATE PROFILE ROWS
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    BEGIN
      INSERT INTO public.profiles (id, name)
      VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

    -- RLS POLICIES

    -- PROFILES
    CREATE POLICY "Users can select own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

    CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

    -- CATEGORIES
    CREATE POLICY "Public read categories" ON categories
    FOR SELECT USING (true);

    CREATE POLICY "Admins manage categories" ON categories
    FOR ALL
    USING ((SELECT "isAdmin" FROM profiles WHERE id = auth.uid()) = true);

    -- PRODUCTS
    CREATE POLICY "Public read products" ON products
    FOR SELECT USING (true);

    CREATE POLICY "Admins manage products" ON products
    FOR ALL
    USING ((SELECT "isAdmin" FROM profiles WHERE id = auth.uid()) = true);

    -- ORDERS
    CREATE POLICY "Users view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

    -- ORDER_ITEMS
    CREATE POLICY "Users view own order_items" ON order_items
    FOR SELECT USING ((SELECT user_id FROM orders WHERE id = order_id) = auth.uid());

    CREATE POLICY "Users insert own order_items" ON order_items
    FOR INSERT WITH CHECK ((SELECT user_id FROM orders WHERE id = order_id) = auth.uid());
    ```

### Running the Application

```sh
npm run dev
```

## Admin Credentials

To access the admin dashboard, you first need to create the admin user and then grant them admin privileges.

1.  Sign up a new user with the following credentials:
    *   **Email:** `muhammadomermustafa@gmail.com`
    *   **Password:** `123456`

2.  Run the following SQL command in your Supabase project's SQL editor to grant admin privileges to the user:
    ```sql
    UPDATE profiles
    SET "isAdmin" = true
    WHERE id = (
      SELECT id FROM auth.users WHERE email = 'muhammadomermustafa@gmail.com'
    );
    ```

3.  You can now log in with the admin credentials and access the admin dashboard.
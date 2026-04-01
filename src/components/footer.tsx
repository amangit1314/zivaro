import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="text-red-500 font-extrabold">Z</span>ivaro
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Your one-stop destination for premium products at unbeatable
              prices.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/categories/clothing"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/shoes"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Shoes
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/electronics"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/accessories"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/customize"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Custom Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Account
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/seller/dashboard"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Seller Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-gray-500">Help Center</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Shipping Info</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Returns</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Contact Us</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-gray-400">
            2026 Zivaro. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-xs text-gray-400">Privacy Policy</span>
            <span className="text-xs text-gray-400">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

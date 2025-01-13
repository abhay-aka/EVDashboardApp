// src/components/Navbar.jsx
export default function Navbar() {
    return (
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">EV Analytics Dashboard</h1>
            </div>
          </div>
        </div>
      </nav>
    );
  }
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = {
  id: "user" | "photographer" | "company";
  title: string;
  label: string;
  image: string;
};

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const roles = useMemo(
    () =>
      [
        { id: "user", title: "STUDENT", label: "ROLE", image: "/img/user.jpg" },
        { id: "photographer", title: "PHOTOGRAPHER", label: "ROLE", image: "/img/photographer.jpg" },
        { id: "company", title: "COMPANY", label: "ROLE", image: "/img/company.jpg" },
      ] satisfies Role[],
    []
  );

  const handleNext = () => {
    if (!selectedRole) return;
    navigate("/register", { state: { role: selectedRole } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-6">
      <h1 className="text-2xl font-semibold mb-12">Choose your role</h1>

      <div className="flex gap-8">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`relative w-[220px] h-[520px] rounded-3xl overflow-hidden group transition-all duration-300
            ${selectedRole === role.id ? "ring-4 ring-white scale-105" : ""}`}
          >
            <img
              height={750}
              src={role.image}
              alt={role.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-12 left-0 right-0 text-center text-white">
              <p className="text-xs tracking-[0.4em] opacity-80">{role.label}</p>
              <p className="text-2xl font-semibold tracking-wide mt-2">{role.title}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedRole && (
        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-gray-600">
            Selected role: <strong>{roles.find((r) => r.id === selectedRole)?.title}</strong>
          </p>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
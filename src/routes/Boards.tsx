import ProtectedRoute from "../utils/ProtectedRoute";
import React from "react";

export default function Boards() {
  return (
    <ProtectedRoute redirect="/boards">
      <div>Boards Page</div>
    </ProtectedRoute>
  );
}


import React from "react";
import { Link } from "react-router-dom";

const ProfileFooter: React.FC = () => {
  return (
    <div className="mt-12 text-center text-gray-500 text-sm">
      <p>
        Powered by <Link to="/" className="text-bento-purple hover:underline">Bento Clone</Link>
      </p>
    </div>
  );
};

export default ProfileFooter;

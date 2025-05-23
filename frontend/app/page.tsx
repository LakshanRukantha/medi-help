import { Button } from "@/components/ui/button";
import React from "react";

const Home = () => {
  return (
    <>
      <div className="text-center text-white pb-2 bg-blue-500 text-5xl">
        <h1>MediHelp</h1>
      </div>
      <Button className="mt-4" variant="default">
        Get Started
      </Button>
    </>
  );
};

export default Home;

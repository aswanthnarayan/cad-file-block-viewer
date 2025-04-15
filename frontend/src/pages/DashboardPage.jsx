
import React from "react";
import { useParams } from "react-router-dom";
import RenderedDXF from "../components/RenderedDxf";
import {BlockDetailsTable} from "../components/BlockDetailsTable";

export default function DashboardPage() {
  const { fileId } = useParams();
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/2 w-full h-1/2 md:h-full border-r">
        <RenderedDXF fileId={fileId} />
      </div>
      <div className="md:w-1/2 w-full h-1/2 md:h-full overflow-auto">
        <BlockDetailsTable fileId={fileId} />
      </div>
    </div>
  );
}
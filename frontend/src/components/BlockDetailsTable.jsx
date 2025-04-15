import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Spinner,
  Typography
} from "@material-tailwind/react";
import { Search } from "lucide-react"; 
import CustomInput from "./CustomInput"; 
import axiosInstance from "../apis/axios";
import useDebounce from "../hooks/useDebounce";
import BlockDetailModal from "./BlockDetailModal";

// Sample table headers
const TABLE_HEAD = ["Sl No", "Name", "Type", "Coordinates (x, y, z)", "Actions"];

export function BlockDetailsTable({fileId}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [loadingBlock, setLoadingBlock] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Debounce the search term
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      try {
        setIsLoading(true);
        // Add filterType to query if selected
        const searchParam = debouncedSearchTerm ? `&search=${encodeURIComponent(debouncedSearchTerm)}` : '';
        const filterParam = filterType ? `&filterType=${filterType}` : '';
        const response = await axiosInstance.get(`/files/${fileId}/blocks/search?page=${currentPage}&limit=${limit}${searchParam}${filterParam}`);
        if (response && response.data) {
          setData(response.data.data || []);
          setTotalPages(response.data.pages || 1);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch block details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlockDetails();
  }, [fileId, currentPage, debouncedSearchTerm, filterType]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleShowBlockDetails = async (blockId) => {
    setModalOpen(true);
    setLoadingBlock(true);
    try {
      const res = await axiosInstance.get(`/blocks/${blockId}`);
      setSelectedBlock(res.data.data || res.data); // adjust as per your API response
    } catch (err) {
      setSelectedBlock({ error: "Failed to fetch block details" });
    }
    setLoadingBlock(false);
  };

  // console.log(selectedBlock);
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Block Details
            </Typography>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="w-full md:w-auto ml-auto flex gap-2 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <CustomInput
                label=""
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="focus:ring-0 focus:border-gray-300 hover:border-gray-400 transition-colors pr-10"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                <Search className="text-gray-400 w-5 h-5" />
              </span>
            </div>
            {/* Filter dropdown */}
            <select
              value={filterType}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white min-w-[130px]"
            >
              <option value="">All Types</option>
              <option value="definition">Definition</option>
              <option value="instance">Instance</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardBody className="overflow-y-auto px-0 pt-0 h-[calc(100vh-290px)] mt-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <table className="w-full min-w-max table-auto text-center">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-center">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70 text-center"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((block, index) => (
                  <tr key={block.id} className="even:bg-blue-gray-50/50">
                    <td className="p-4 text-center">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {(currentPage - 1) * limit + index + 1}
                      </Typography>
                    </td>
                    <td className="p-4 text-center">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {block.name}
                      </Typography>
                    </td>
                    <td className="p-4 text-center">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {block.type}
                      </Typography>
                    </td>
                    <td className="p-4 text-center">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {`x: ${block.coordinates?.x ?? 0}, y: ${block.coordinates?.y ?? 0}, z: ${block.coordinates?.z ?? 0}`}
                      </Typography>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        size="sm"
                        color="blue"
                        onClick={() => handleShowBlockDetails(block.id)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="text-center p-6 text-gray-400">
                    No blocks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </CardBody>

      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <div className="flex items-center gap-2">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {currentPage} of {totalPages}
          </Typography>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {/* Page number buttons */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Center the window around currentPage if possible
            let pageNum = i + 1;
            if (totalPages > 5) {
              if (currentPage > 3 && currentPage <= totalPages - 2) {
                pageNum = currentPage - 2 + i;
              } else if (currentPage > totalPages - 2) {
                pageNum = totalPages - 4 + i;
              }
            }
            if (pageNum < 1 || pageNum > totalPages) return null;
            return (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? "filled" : "outlined"}
                size="sm"
                className={pageNum === currentPage ? "bg-blue-500 text-white" : ""}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardFooter>
      <BlockDetailModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedBlock(null); }}
        block={loadingBlock ? null : selectedBlock}
      />
    </Card>
  );
}

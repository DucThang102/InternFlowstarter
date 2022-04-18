import React from "react";
import {
  Pagination as PaginationMui,
  PaginationItem,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function Pagination({ currentPage, totalPage, onPageChange }) {
  const handleChangePage = (e, page) => {
    onPageChange(page);
  };
  return (
    <Stack spacing={2} pb={4} pt={2}>
      <PaginationMui
        color="primary"
        onChange={handleChangePage}
        page={currentPage}
        count={totalPage}
        renderItem={(item) => (
          <PaginationItem
            components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
            {...item}
          />
        )}
      />
    </Stack>
  );
}

export default Pagination;

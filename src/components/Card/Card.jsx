import MoveUpRoundedIcon from "@mui/icons-material/MoveUpRounded";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card as CardMui,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";
import { getLabels } from "../../utils/common";

function Card({ item, onOpen, setId, loading, idTransfer }) {
  const { id, avatar, class: className, generation, sex, star } = item;

  const handleShowModal = () => {
    if (loading) return;
    setId(id);
    onOpen();
  };

  return (
    <Box>
      <CardMui sx={{ pt: 1, maxWidth: { xs: "100%", sm: 345 } }}>
        <CardMedia
          sx={{
            borderRadius: "100%",
            objectFit: "cover",
            width: "140px",
            m: "0 auto",
          }}
          component="img"
          height="140"
          // width="140"
          image={avatar}
          alt="green iguana"
        />
        <CardContent sx={{ textAlign: "center" }}>
          <Typography mb={1} variant="body2" color="text.secondary">
            class: {getLabels("Class")[className]}
          </Typography>
          <Typography mb={1} variant="body2" color="text.secondary">
            sex: {getLabels("Sex")[sex]}
          </Typography>
          <Typography mb={1} variant="body2" color="text.secondary">
            generation: {getLabels("Generation")[generation]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            star: {getLabels("Star")[star]}
          </Typography>
        </CardContent>
        <CardActions>
          <LoadingButton
            onClick={handleShowModal}
            loadingPosition="start"
            startIcon={<MoveUpRoundedIcon />}
            loading={loading && idTransfer === id}
            size="small"
            variant="outlined"
          >
            Transfer
          </LoadingButton>
        </CardActions>
      </CardMui>
    </Box>
  );
}

export default Card;

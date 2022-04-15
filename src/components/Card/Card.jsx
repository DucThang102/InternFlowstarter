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
      <CardMui sx={{ maxWidth: { xs: "100%", sm: 345 } }}>
        <CardMedia
          component="img"
          height="140"
          image={avatar}
          alt="green iguana"
        />
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            class: {getLabels("Class")[className]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            sex: {getLabels("Sex")[sex]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
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
          >
            Transfer
          </LoadingButton>
        </CardActions>
      </CardMui>
    </Box>
  );
}

export default Card;

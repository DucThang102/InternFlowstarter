import { Grid } from "@mui/material";
import React, { useState } from "react";
import useContract from "../../hooks/useContract";
import { generateErrMsg } from "../../utils/common";
import { notify } from "../../utils/toastify";
import Card from "../Card/Card";
import Modal from "../Modal/Modal";

function CardList({ data = [], currentAcc, signer, getHeroOfAccount }) {
  const contract = useContract(signer);
  const [showModal, setShowModal] = useState(false);
  const [idTransfer, setIdTransfer] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (toAcc) => {
    if (!signer) {
      notify.error("You aren't connect to wallet");
      return;
    }
    setLoading(true);
    try {
      const res = await contract.transferHero(currentAcc, toAcc, idTransfer);
      const status = (await res.wait()).status;

      if (status === 1) {
        notify.success("Transfer success");
        getHeroOfAccount();
      }
    } catch (error) {
      console.log(error);
      notify.error(generateErrMsg(error.message));
    }
    setLoading(false);
  };
  return (
    <>
      <Grid
        sx={{ mb: 3, minHeight: { xs: "1387px", sm: "1040px", lg: "694px" } }}
        container
        spacing={2}
      >
        {data.map((item) => (
          <Grid key={item.id} item xxs={12} xs={6} sm={4} lg={3}>
            <Card
              item={item}
              onOpen={() => setShowModal(true)}
              idTransfer={idTransfer}
              setId={(id) => {
                setIdTransfer(id);
              }}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>
      <Modal
        show={showModal}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

export default CardList;

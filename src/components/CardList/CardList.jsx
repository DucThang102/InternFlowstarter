import { Grid } from "@mui/material";
import React, { useState } from "react";
import useContract from "../../hooks/useContract";
import Card from "../Card/Card";
import Modal from "../Modal/Modal";

function CardList({
  data = [],
  currentAcc,
  signer,
  setSnackbar,
  getHeroOfAccount,
}) {
  const contract = useContract(signer);
  const [showModal, setShowModal] = useState(false);
  const [idTransfer, setIdTransfer] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (toAcc) => {
    console.log(signer);
    setLoading(true);
    if (!signer)
      setSnackbar({ type: "error", msg: "You aren't connect to wallet" });
    try {
      const res = await contract.transferHero(currentAcc, toAcc, idTransfer);
      const status = (await res.wait()).status;
      console.log(status);

      if (status === 1) {
        setSnackbar({ type: "success", msg: "Transfer success" });
        getHeroOfAccount();
      }
    } catch (error) {
      console.log(error);
      setSnackbar({ type: "error", msg: "You have not permission" });
    }
    setLoading(false);
  };
  return (
    <>
      <Grid container spacing={2}>
        {data.map((item) => (
          <Grid key={item.id} item xs={12} sm={6} md={3}>
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

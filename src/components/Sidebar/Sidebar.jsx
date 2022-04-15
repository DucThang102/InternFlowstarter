import { PhotoCamera } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, CircularProgress, IconButton, Input } from "@mui/material";
import { create } from "ipfs-http-client";
import React, { useState } from "react";
import useContract from "../../hooks/useContract";
import FieldSelect from "../FieldSelect/FieldSelect";

function Sidebar({ signer, getHeroOfAccount, setSnackbar }) {
  const client = create("https://ipfs.infura.io:5001/api/v0");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const contract = useContract(signer);

  const [formValues, setFormValue] = useState(() => ({
    fileUrl: "",
    class: 0,
    sex: 0,
    generation: 0,
    star: 0,
  }));

  const fields = [
    {
      title: "Class",
      values: [0, 1, 2, 3, 4, 5],
      defaultValue: formValues.class,
    },
    {
      title: "Sex",
      values: [0, 1],
      defaultValue: formValues.sex,
    },
    {
      title: "Generation",
      values: [0, 1],
      defaultValue: formValues.generation,
    },
    {
      title: "Star",
      values: [0, 1, 2, 3, 4, 5],
      defaultValue: formValues.star,
    },
  ];

  const handleChange = async (e) => {
    setLoadingUpload(true);
    const file = e.target.files[0];
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFormValue({
        ...formValues,
        fileUrl: url,
      });
    } catch (error) {
      console.log(error);
    }
    setLoadingUpload(false);
  };

  const handleSelect = (newValue) => {
    setFormValue({
      ...formValues,
      ...newValue,
    });
  };

  const handleSubmit = async () => {
    if (!formValues.fileUrl) {
      setSnackbar({ type: "error", msg: "No photo yet" });
      return;
    }
    setLoadingSubmit(true);
    try {
      const { fileUrl, class: class2, sex, generation, star } = formValues;
      const res = await contract.createHero(
        fileUrl,
        class2,
        sex,
        generation,
        star
      );
      const status = (await res.wait()).status;
      if (status === 1) {
        setSnackbar({ type: "success", msg: "Create hero success" });
        getHeroOfAccount();
      }
    } catch (error) {
      setSnackbar({ type: "error", msg: "You aren't connect to wallet" });
      console.log(error);
    }
    setLoadingSubmit(false);
  };

  return (
    <>
      <Box>
        <Box>
          <label htmlFor="icon-button-file">
            <Input
              sx={{ display: "none" }}
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={handleChange}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              disabled={loadingUpload}
            >
              <PhotoCamera />
            </IconButton>
          </label>
          {loadingUpload && <CircularProgress size={18} color="secondary" />}
        </Box>
        <Box mt={2.8}>
          {fields.map((field) => {
            const { title, defaultValue, values } = field;
            return (
              <FieldSelect
                key={title}
                title={title}
                defaultValue={defaultValue}
                values={values}
                onSelect={handleSelect}
              />
            );
          })}
        </Box>
        <LoadingButton
          onClick={handleSubmit}
          loading={loadingSubmit}
          loadingPosition="start"
          startIcon={<AddCircleOutlineIcon />}
          variant="contained"
        >
          Create
        </LoadingButton>
      </Box>
    </>
  );
}

export default Sidebar;

import { PhotoCamera } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/material";
import { create } from "ipfs-http-client";
import React, { useEffect, useState } from "react";
import imgGrey from "../../assets/200x120-a1a1aa7f.png";
import useContract from "../../hooks/useContract";
import { notify } from "../../utils/toastify";
import FieldSelect from "../FieldSelect/FieldSelect";
import CloseIcon from "@mui/icons-material/Close";
import { FILE_SIZE, SUPPORTED_FORMATS } from "../../constants/globalConstants";

function Sidebar({ signer, getHeroOfAccount, onToggleMenu }) {
  const client = create("https://ipfs.infura.io:5001/api/v0");

  const [imgPreview, setImgPreview] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errMsgFile, setErrMsgFile] = useState("");
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

  useEffect(() => {
    return () => URL.revokeObjectURL(imgPreview);
  }, [imgPreview]);

  const handleChange = async (e) => {
    setErrMsgFile("");
    const file = e.target.files[0];
    if (file?.size > FILE_SIZE) return setErrMsgFile("File too large");
    if (!SUPPORTED_FORMATS.includes(file?.type)) {
      return setErrMsgFile("Unsupported format");
    }
    setLoadingUpload(true);
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFormValue({
        ...formValues,
        fileUrl: url,
      });
      setImgPreview(URL.createObjectURL(file));
    } catch (error) {
      console.log(error);
      notify.error(error.message);
    }
    setLoadingUpload(false);
  };

  const resetFormValues = () => {
    setFormValue({
      fileUrl: "",
      class: 0,
      sex: 0,
      generation: 0,
      star: 0,
    });
    setImgPreview("");
  };

  const handleSelect = (newValue) => {
    setFormValue({
      ...formValues,
      ...newValue,
    });
  };

  const handleSubmit = async () => {
    if (!signer) {
      notify.error("You aren't connect to wallet");
      return;
    }
    if (!formValues.fileUrl) {
      notify.error("No photo yet");
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
        notify.success("Create hero success");
        getHeroOfAccount();
        resetFormValues();
        onToggleMenu && onToggleMenu(false);
      }
    } catch (error) {
      notify.error("Something went wrong");
      console.log(error);
    }
    setLoadingSubmit(false);
  };

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" pt={1}>
        <IconButton
          sx={{ display: { xs: "block", sm: "none" }, mr: { xxs: -1, xs: 0 } }}
          aria-label="delete"
          onClick={() => onToggleMenu && onToggleMenu(false)}
          size="large"
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </Stack>
      <Box sx={{ px: { xxs: 1, xs: 2, md: 0 }, py: { xs: 2, md: 0 } }}>
        <Stack>
          <img
            style={{ objectFit: "cover", maxWidth: "100%" }}
            src={imgPreview || imgGrey}
            alt=""
          />
          <Typography color="error" variant="caption">
            {errMsgFile}
          </Typography>
          <Stack direction="row" alignItems="center">
            <label
              style={{ width: "100%" }}
              htmlFor={!loadingUpload ? "icon-button-file" : ""}
            >
              <Input
                sx={{ display: "none" }}
                id="icon-button-file"
                type="file"
                onChange={handleChange}
                inputProps={{
                  accept: "image/*",
                }}
              />
              <LoadingButton
                sx={{ mt: 1 }}
                fullWidth
                loading={loadingUpload}
                loadingPosition="start"
                startIcon={<PhotoCamera />}
                variant="contained"
                component="span"
              >
                Photo
              </LoadingButton>
            </label>
          </Stack>
        </Stack>
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
        <Stack
          sx={{
            flexDirection: { md: "column", lg: "row" },
            rowGap: { xxs: 1 },
            columnGap: { lg: 1 },
          }}
        >
          <Button fullWidth onClick={resetFormValues} variant="outlined">
            Clear
          </Button>
          <LoadingButton
            fullWidth
            onClick={handleSubmit}
            loading={loadingSubmit}
            loadingPosition="start"
            startIcon={<AddCircleOutlineIcon />}
            variant="contained"
          >
            Create
          </LoadingButton>
        </Stack>
      </Box>
    </>
  );
}

export default Sidebar;

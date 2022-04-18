import "./App.css";
import {
  Form,
  Button,
  Select,
  Row,
  Col,
  Card,
  notification,
  Spin,
  Modal,
  Input,
  Pagination,
  Tooltip,
} from "antd";
import { ethers } from "ethers";
import React from "react";
import abi from "./HeroFi.json";
import { create } from "ipfs-http-client";

const dropDown = {
  sex: [
    { label: "Male", value: 0 },
    { label: "Female", value: 1 },
  ],
  generation: [
    { label: "GENESIS", value: 0 },
    { label: "NORMAL", value: 1 },
  ],
  heroClass: [
    { label: "WATER", value: 0 },
    { label: "PLANT", value: 1 },
    { label: "FIRE", value: 2 },
    { label: "THUNDER", value: 3 },
    { label: "DARK", value: 4 },
    { label: "LIGHT", value: 5 },
  ],
  star: [
    { label: "ONE", value: 0 },
    { label: "TWO", value: 1 },
    { label: "THREE", value: 2 },
    { label: "FOUR", value: 3 },
    { label: "FIVE", value: 4 },
    { label: "SIX", value: 5 },
  ],
};

function App() {
  const CONTRACT_ADDRESS = "0x7575c71C24091954d219d59E3513b59f8F8a552f";
  const [connected, setConnected] = React.useState(false);
  const [account, setAccount] = React.useState("");
  const [signer, setSigner] = React.useState("");
  const [heroes, setHeroes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [address, setAddress] = React.useState("");
  const [selectedHero, setSelectedHero] = React.useState({});
  const [visibleTransfer, setVisibleTransfer] = React.useState(true);
  const [fileUrl, setFileUrl] = React.useState("");
  const [messErr, setMessErr] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [provider, setProvider] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [dataRender, setDataRender] = React.useState([]);
  const [totalRecord, setTotalRecord] = React.useState(0);

  const renderSelect = (type) => {
    return dropDown[type].map((item) => {
      return (
        <Select.Option key={item.value} value={item.value}>
          {item.label}
        </Select.Option>
      );
    });
  };

  const handleUploadImg = async (e) => {
    const inputFile = document.querySelector(".img_file");
    const client = create("https://ipfs.infura.io:5001/api/v0");
    const file = e.target.files[0];
    const maxSize = 1000000;
    const { type, size } = file;
    if (type === "image/png" || type === "image/jpeg" || type === "image/jpg") {
      setMessErr("");
      if (size <= maxSize) {
        try {
          const added = await client.add(file);
          const url = `https://ipfs.infura.io/ipfs/${added.path}`;
          setFileUrl(url);
        } catch (error) {
          setMessErr("Error uploading file: ", error);
        }
      } else {
        setMessErr("Maximum size is 1MB");
      }
    } else {
      setMessErr("Format not supported");
      inputFile.value = "";
    }
  };

  const handleCreateHero = async (values) => {
    setLoading(true);
    if (signer) {
      if (fileUrl) {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
        try {
          const response = await contract.createHero(
            fileUrl,
            values.class,
            values.sex,
            values.generation,
            values.star
          );
          const res = await response.wait();
          getHeroesOfAccount();
          setLoading(false);
          if (res.status === 1) {
            notification.success({ message: "Create Hero Successfully" });
          } else {
            notification.error({ message: "An error occurred" });
          }
        } catch (error) {
          notification.error({ message: error.message });
          setLoading(false);
        }
      } else {
        setMessErr("Select Image For NFT");
        setLoading(false);
      }
    } else {
      notification.error({ message: "You are not connected to metamask" });
      setLoading(false);
    }
  };

  const renderTitleCard = (item) => {
    const sex = dropDown.sex.filter((sex) => sex.value === item.sex);
    const heroClass = dropDown.heroClass.filter(
      (heroClass) => heroClass.value === item.class
    );
    const generation = dropDown.generation.filter(
      (generation) => generation.value === item.generation
    );
    const star = dropDown.star.filter((star) => star.value === item.star);
    return (
      <div className="card-title">
        <div>Class: {heroClass[0].label}</div>
        <div>Sex: {sex[0].label}</div>
        <div>Generation: {generation[0].label}</div>
        <div>Star: {star[0].label}</div>
      </div>
    );
  };

  const connectMetamask = async () => {
    setLoading(true);
    try {
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      setAccount(account);
      setSigner(signer);
      setConnected(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notification.error({ message: "MetaMask is not installed" });
    }
  };

  const getAllHeroes = async () => {
    if (provider) {
      setLoading(true);
      try {
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          abi.abi,
          provider
        );
        const response = await contract.getAllHeroes();
        setTotalRecord(response.length);
        setHeroes(response);
      } catch (error) {
        notification.error({ message: error.message });
        setLoading(false);
      }
      setLoading(false);
    }
  };

  const getHeroesOfAccount = async () => {
    setLoading(true);
    if (signer) {
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
        const response = await contract.getHeroesOfAccount();
        setHeroes(response);
        setTotalRecord(response.length);
      } catch (error) {
        notification.error({ message: error.message });
        setLoading(false);
      }
    } else {
      notification.error({ message: "You are not connected to metamask" });
      setLoading(false);
    }
    setLoading(false);
  };

  const handleTranfer = async () => {
    setLoading(true);
    if (signer) {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
      try {
        const response = await contract.transferHero(
          account,
          address,
          selectedHero.id
        );
        const res = await response.wait();
        const { status } = res;
        if (status === 1) {
          notification.success({ message: "Transfer this hero successfully" });
          getHeroesOfAccount();
        } else {
          notification.error({ message: "An error occurred" });
        }
      } catch (error) {
        notification.error({ message: error.message });
        setLoading(false);
      }
      setLoading(false);
      setVisibleModal(false);
      setAddress("");
    } else {
      notification.error({ message: "You are not connected to metamask" });
      setLoading(false);
    }
  };

  const onChangePage = (page = 1, pageSize = 5) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  React.useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    } else {
      notification.error({ message: "MetaMask is not installed" });
    }
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    getAllHeroes();
    // eslint-disable-next-line
  }, [provider]);

  React.useEffect(() => {
    const minValue = (currentPage - 1) * pageSize;
    const maxValue = currentPage * pageSize;
    const newData = [];
    heroes.map((item, index) => {
      if (index >= minValue && index < maxValue) {
        newData.push(item);
      }
    });
    setDataRender(newData);
  }, [currentPage, pageSize, heroes]);
  return (
    <div className="App">
      <Spin spinning={loading} tip="Loading...">
        <div className="heroes">
          <Row>
            <Col xl={8} md={0} xs={0}></Col>
            <Col xl={12} md={12} xs={24}>
              <Button
                style={{ marginRight: "10px" }}
                type={active === 0 ? "primary" : ""}
                onClick={() => {
                  getAllHeroes();
                  setActive(0);
                  setCurrentPage(1);
                  setVisibleTransfer(true);
                }}
              >
                All Heroes
              </Button>
              <Button
                disabled={signer === ""}
                type={active === 1 ? "primary" : ""}
                onClick={() => {
                  getHeroesOfAccount();
                  setActive(1);
                  setCurrentPage(1);
                  setVisibleTransfer(false);
                }}
              >
                My Heroes
              </Button>
            </Col>
            <Col xl={4} md={12} xs={24}>
              <Tooltip placement="top" title={account}>
                <Button
                  className="info-signer"
                  disabled={connected}
                  onClick={() => connectMetamask()}
                >
                  {!connected ? "Connect Metamask" : account}
                </Button>
              </Tooltip>
            </Col>
          </Row>
          <Row style={{ paddingTop: "20px" }}>
            <Col xl={8} md={24} xs={24}>
              <Form
                layout="vertical"
                initialValues={{
                  class: 0,
                  sex: 0,
                  generation: 0,
                  star: 0,
                }}
                onFinish={handleCreateHero}
              >
                <Form.Item
                  label="Avatar"
                  extra={
                    <div>
                      <div>JPG/JPEG/PNG </div>
                      <div> Maximum: 1MB</div>
                    </div>
                  }
                >
                  <input
                    type="file"
                    className="img_file"
                    onChange={handleUploadImg}
                    accept="image/*"
                  />
                  <div style={{ color: "red" }}> {messErr} </div>
                </Form.Item>
                <Row gutter={64}>
                  <Col xl={20} md={12} xs={24}>
                    <Form.Item name="class" label="Class">
                      <Select>{renderSelect("heroClass")}</Select>
                    </Form.Item>
                  </Col>
                  <Col xl={20} md={12} xs={24}>
                    <Form.Item name="sex" label="Sex">
                      <Select>{renderSelect("sex")}</Select>
                    </Form.Item>
                  </Col>
                  <Col xl={20} md={12} xs={24}>
                    <Form.Item name="generation" label="Generation">
                      <Select>{renderSelect("generation")}</Select>
                    </Form.Item>
                  </Col>
                  <Col xl={20} md={12} xs={24}>
                    <Form.Item name="star" label="Star">
                      <Select>{renderSelect("star")}</Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Button type="default" htmlType="submit">
                  Create Hero
                </Button>
              </Form>
            </Col>
            <Col xl={16} md={24}>
              <Row gutter={64} style={{ paddingTop: "16px" }}>
                {dataRender.map((item, index) => {
                  return (
                    <Col
                      style={{ paddingTop: "10px" }}
                      xxl={8}
                      xl={12}
                      md={12}
                      xs={24}
                      key={index}
                    >
                      <Card
                        hoverable
                        cover={
                          <img
                            alt="example"
                            style={{
                              height: "240px",
                              objectFit: "cover",
                            }}
                            src={item.avatar}
                          />
                        }
                      >
                        <Card.Meta title={renderTitleCard(item)} />
                        {!visibleTransfer ? (
                          <Button
                            onClick={() => {
                              setVisibleModal(true);
                              setSelectedHero(item);
                            }}
                            type="primary"
                            style={{ marginTop: "15px" }}
                          >
                            Transfer
                          </Button>
                        ) : (
                          ""
                        )}
                      </Card>
                    </Col>
                  );
                })}
              </Row>
              {totalRecord ? (
                <Pagination
                  style={{ float: "right", margin: "30px 0" }}
                  onChange={onChangePage}
                  defaultPageSize={10}
                  defaultCurrent={1}
                  total={totalRecord}
                  showTotal={(total) => {
                    return `Total ${total} items`;
                  }}
                />
              ) : (
                ""
              )}
            </Col>
          </Row>
        </div>
        <Modal
          centered
          title="Transfer Hero"
          visible={visibleModal}
          onOk={handleTranfer}
          onCancel={() => {
            setVisibleModal(false);
          }}
        >
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Receiver's address"
          />
        </Modal>
      </Spin>
    </div>
  );
}

export default App;

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
  const [address, setAdress] = React.useState("");
  const [selectedHero, setSelectedHero] = React.useState({});
  const [visibleTransfer, setVisibleTransfer] = React.useState(true);
  const [fileUrl, setFileUrl] = React.useState("");

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
    const client = create("https://ipfs.infura.io:5001/api/v0");
    const file = e.target.files[0];
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
      console.log('upload');
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  const handleCreateHero = async (values) => {
    setLoading(true);
    if (signer !== "") {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi.abi,
        signer
      );
      try {
        const response = await contract.createHero(
          fileUrl,
          values.class,
          values.sex,
          values.generation,
          values.star
        );
        const res = await response.wait();
        getAllHeroes();
        setLoading(false);
        if (res.status === 1) {
          notification.success({ message: "Create Hero Successfully" });
        } else {
          notification.error({ message: "Create Hero Error" });
        }
      } catch (error) {
        console.log(error);
      }
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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    console.log(signer);
    setAccount(account);
    setSigner(signer);
    setConnected(true);
    setLoading(false);
  };

  const getAllHeroes = async () => {
    setLoading(true);
    if (signer !== "") {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi.abi,
        signer
      );
      const response = await contract.getAllHeroes();
      setHeroes(response);
    }
    setLoading(false);
  };

  const getHeroesOfAccount = async () => {
    setLoading(true);
    if (signer !== "") {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi.abi,
        signer
      );
      const response = await contract.getHeroesOfAccount();
      console.log(response);
      setHeroes(response);
    }
    setLoading(false);
  };

  const handleTranfer = async () => {
    setLoading(true);
    if (signer !== "") {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi.abi,
        signer
      );
      console.log(account, address, selectedHero.id);
      try {
        const response = await contract.transferHero(
          account,
          address,
          selectedHero.id
        );
        const res = await response.wait();
        console.log(res);
        notification.success({ message: "Transfer this hero successfully" });
        getAllHeroes();
      } catch (error) {
        notification.error({ message: "Transfer this hero error" });
      }
      setLoading(false);
      setVisibleModal(false);
      setAdress("");
    }
  };

  React.useEffect(() => {
    getAllHeroes();
    // eslint-disable-next-line
  }, [signer]);

  React.useEffect(() => {
    connectMetamask();
    // eslint-disable-next-line
  }, [])

  return (
    <div className="App">
      <Spin spinning={loading} tip="Loading...">
        <div className="heroes">
          <Row>
            <Col span={8}></Col>
            <Col span={12}>
              <Button
                onClick={() => {
                  getAllHeroes();
                  setVisibleTransfer(true);
                }}
              >
                All Heroes
              </Button>
              <Button
                onClick={() => {
                  getHeroesOfAccount();
                  setVisibleTransfer(false);
                }}
              >
                My Heroes
              </Button>
            </Col>
            <Col span={4}>
              <Button
                disabled={connected}
                style={{ float: "right" }}
                onClick={() => connectMetamask()}
              >
                {!connected ? "Connect Metamask" : account}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="vertical"
                onFinish={handleCreateHero}
              >
                <Form.Item label="Avatar">
                  <input type="file" onChange={handleUploadImg} />
                </Form.Item>
                <Form.Item name="class" label="Class">
                  <Select>{renderSelect("heroClass")}</Select>
                </Form.Item>
                <Form.Item name="sex" label="Sex">
                  <Select>{renderSelect("sex")}</Select>
                </Form.Item>
                <Form.Item name="generation" label="Generation">
                  <Select>{renderSelect("generation")}</Select>
                </Form.Item>
                <Form.Item name="star" label="Star">
                  <Select>{renderSelect("star")}</Select>
                </Form.Item>
                <Button type="default" htmlType="submit">
                  Create Hero
                </Button>
              </Form>
            </Col>
            <Col span={16}>
              <Row style={{ paddingTop: "16px" }}>
                {heroes.map((item, index) => {
                  return (
                    <Col style={{ paddingTop: "10px" }} span={8} key={index}>
                      <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={
                          <img
                            alt="example"
                            style={{
                              width: "240px",
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
            onChange={(e) => setAdress(e.target.value)}
            placeholder="Receiver's address"
          />
        </Modal>
      </Spin>
    </div>
  );
}

export default App;

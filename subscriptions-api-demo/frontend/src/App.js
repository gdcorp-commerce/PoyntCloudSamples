import { useEffect, useState } from "react";
import {
  createSubscription,
  getAccessToken,
  getPlans,
  getSubscriptions,
} from "./service";

// or less ideally
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Navbar,
  Row,
  Table,
} from "react-bootstrap";
function App() {
  const [businessId, setBusinessId] = useState();
  const [code, setCode] = useState();
  const [accessToken, setAccessToken] = useState();
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [plan, setPlan] = useState();
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState();
  const [replaceV2, setReplaceV2] = useState(false);

  useEffect(() => {
    getPlansData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    buildAccessToken(params);
  }, [code]);

  useEffect(() => {
    if (businessId && accessToken) getSubscriptionsData();
  }, [businessId, accessToken]);

  const getPlansData = async () => {
    const data = await getPlans();
    setPlans(data);
  };

  const getSubscriptionsData = async () => {
    const data = await getSubscriptions(accessToken, businessId);
    const plan = plans.find((plan) =>
      data.find((sub) => sub.planId === plan.planId)
    );
    if (plan) setReplaceV2(true);
    setCurrentPlan(plan);
    setSubscriptions(data);
  };

  const isSubscribed = (plan) => {
    return subscriptions.find((sub) => sub.planId === plan.planId);
  };

  const isScheduleToCancel = (plan) => {
    return subscriptions.find(
      (sub) =>
        sub.status === "ACTIVE" &&
        sub.planId === plan.planId &&
        sub.endAt != null
    );
  };
  const getLabel = (plan) => {
    const currentSubscription = subscriptions.find(
      (sub) => sub.planId === plan.planId
    );

    if (isScheduleToCancel(plan)) return "Restore";
    if (currentSubscription) return "Subscribed";
    if (currentPlan) {
      if (currentPlan.scope !== plan.scope) return "Switch plan";
      if (plan.amount >= currentPlan.amount) return "Upgrade";
      else return "Downgrade";
    }
    return "Subscribe";
  };

  const buildAccessToken = async (params) => {
    setBusinessId(params.get("businessId"));

    const lastCode = params.get("code");
    setCode(lastCode);
    if (lastCode) {
      setAccessToken(await getAccessToken(lastCode));
    }
  };

  const subscribe = async (plan) => {
    if (!accessToken) {
      window.location.href =
        "https://poynt.dev-godaddy.com/applications/authorize?client_id=urn:aid:9c555958-73b6-48e1-819e-f94f1f354264&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F";
    }
    setPlan(plan);
    setLoading(true);
    const isDeviceScope = plan.scope === "DEVICE";
    const data = await createSubscription(
      accessToken,
      businessId,
      plan.planId,
      replaceV2,
      isDeviceScope
    );
    await getSubscriptionsData();
    setLoading(false);
    console.log("Subscription created: ", data);
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Plans</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {businessId ? (
                <div>
                  Signed in as: <a href="#login">{businessId}</a>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    window.location.href =
                      "https://poynt.dev-godaddy.com/applications/authorize?client_id=urn:aid:9c555958-73b6-48e1-819e-f94f1f354264&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F";
                  }}
                >
                  Sign in
                </Button>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />

      <Container>
        <Breadcrumb>
          <Breadcrumb.Item href="#">Home</Breadcrumb.Item>

          <Breadcrumb.Item active>Plans and Pricing</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          {plans?.map((record) => (
            <Col>
              <Card style={{ width: "18rem" }}>
                <Card.Img variant="top" />
                <Card.Body>
                  <Card.Title>{record.name}</Card.Title>
                  <Card.Text>{record.description}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>Scope - {record.scope}</ListGroup.Item>
                  <ListGroup.Item>
                    R$ {record.amount} - {record.interval}
                  </ListGroup.Item>
                </ListGroup>
                <Card.Body>
                  <Button
                    disabled={
                      (!isScheduleToCancel(record) && isSubscribed(record)) ||
                      (loading && record === plan)
                    }
                    onClick={() => subscribe(record)}
                    variant="primary"
                  >
                    {" "}
                    {loading && record === plan
                      ? "Subscribing..."
                      : getLabel(record)}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <br />
      <Container>
        <h5>Subscriptions</h5>
        <br />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th># Id</th>
              <th>Business</th>
              <th>Status</th>
              <th>Scope</th>
              <th>Start at</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions?.map((sub) => (
              <tr>
                <td>{sub.subscriptionId}</td>
                <td>{sub.businessId}</td>
                <td>{sub.status}</td>
                <td>{sub.scope}</td>
                <td>{sub.startAt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default App;

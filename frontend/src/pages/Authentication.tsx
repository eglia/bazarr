import { useSystem } from "@/apis/hooks";
import { useReduxStore } from "@/modules/redux/hooks/base";
import { FunctionComponent, useState } from "react";
import { Button, Card, Form, Image, Spinner } from "react-bootstrap";
import { Navigate } from "react-router-dom";

const Authentication: FunctionComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, isWorking } = useSystem();

  const authenticated = useReduxStore(
    (s) => s.site.status !== "unauthenticated"
  );

  if (authenticated) {
    return <Navigate to="/"></Navigate>;
  }

  return (
    <div className="d-flex bg-light vh-100 justify-content-center align-items-center">
      <Card className="auth-card shadow">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            login({ username, password });
          }}
        >
          <Card.Body>
            <Form.Group className="mb-5 d-flex justify-content-center">
              <Image width="64" height="64" src="/static/logo128.png"></Image>
            </Form.Group>
            <Form.Group>
              <Form.Control
                disabled={isWorking}
                name="username"
                type="text"
                placeholder="Username"
                required
                onChange={(e) => setUsername(e.currentTarget.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Control
                disabled={isWorking}
                name="password"
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.currentTarget.value)}
              ></Form.Control>
            </Form.Group>
            {/* <Collapse in={error.length !== 0}>
              <div>
                <Alert variant="danger" className="m-0">
                  {error}
                </Alert>
              </div>
            </Collapse> */}
          </Card.Body>
          <Card.Footer>
            <Button type="submit" disabled={isWorking} block>
              {isWorking ? (
                <Spinner size="sm" animation="border"></Spinner>
              ) : (
                "LOGIN"
              )}
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    </div>
  );
};

export default Authentication;

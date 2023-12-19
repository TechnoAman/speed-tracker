import React from "react";
import "./App.css";
import ReactSpeedometer from "react-d3-speedometer";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class Gauge extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.speed)
    return (
      <div className="center">
        <h1 className="title">Bowling speed meter</h1>

        <Container className="p-3">
          <Row>
            <Col>
              <div className="speedometer">
                <ReactSpeedometer
                  maxValue={180}
                  ringWidth={20}
                  customSegmentStops={[
                    0, 20, 40, 60, 80, 100, 120, 140, 160, 180,
                  ]}
                  segmentColors={[
                    "#FAFAFA",
                    "#FAFAFA",
                    "#FAFAFA",
                    "#FAFAFA",
                    "#FAFAFA",
                    "#007fff",
                    "#007fff",
                    "#e63946",
                    "#e63946",
                    "#FAFAFA",
                  ]}
                  needleTransitionDuration={9000}
                  needleTransition="easeElastic"
                  currentValueText="${value} Km/h"
                  value={this.props.speed}
                />
              </div>
            </Col>
           
          </Row>
        </Container>
      </div>
    );
  }
}

export default Gauge;

